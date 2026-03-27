import { Page } from "@playwright/test";

// Minimal valid HLS master playlist
const MASTER_PLAYLIST = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
/mock-hls/360p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=854x480
/mock-hls/480p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720
/mock-hls/720p.m3u8
`;

// Minimal valid HLS media playlist (VOD - 3 segments, 2s each)
const MEDIA_PLAYLIST = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:2
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-PLAYLIST-TYPE:VOD
#EXTINF:2.000,
/mock-hls/segment0.ts
#EXTINF:2.000,
/mock-hls/segment1.ts
#EXTINF:2.000,
/mock-hls/segment2.ts
#EXT-X-ENDLIST
`;

// Minimal valid MPEG-TS segment (188 bytes = 1 null TS packet)
// This is the smallest valid TS packet: sync byte (0x47) + null PID (0x1FFF) + padding
function createMinimalTsSegment(): Buffer {
  const packet = Buffer.alloc(188);
  packet[0] = 0x47; // sync byte
  packet[1] = 0x1f; // PID high byte (null PID 0x1FFF)
  packet[2] = 0xff; // PID low byte
  packet[3] = 0x10; // adaptation field control: payload only
  // Rest is padding (zeros) which is valid for null packets
  // Repeat for ~2 seconds of null content (2s * ~750 packets/sec for low bitrate)
  // But for testing, a few packets are enough
  const segment = Buffer.alloc(188 * 10);
  for (let i = 0; i < 10; i++) {
    packet.copy(segment, i * 188);
  }
  return segment;
}

/**
 * Intercept HLS requests and return mock streams.
 * Call this before navigating to a page with a player.
 */
export async function mockHlsStream(page: Page): Promise<void> {
  const tsSegment = createMinimalTsSegment();

  await page.route("**/*.m3u8", async (route) => {
    const url = route.request().url();

    if (url.includes("master") || !url.includes("/mock-hls/")) {
      // Master playlist or any non-mock m3u8 — return master
      await route.fulfill({
        status: 200,
        contentType: "application/vnd.apple.mpegurl",
        body: MASTER_PLAYLIST,
      });
    } else {
      // Media playlist (360p, 480p, 720p)
      await route.fulfill({
        status: 200,
        contentType: "application/vnd.apple.mpegurl",
        body: MEDIA_PLAYLIST,
      });
    }
  });

  await page.route("**/*.ts", async (route) => {
    if (route.request().url().includes("/mock-hls/")) {
      await route.fulfill({
        status: 200,
        contentType: "video/mp2t",
        body: tsSegment,
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Intercept the actual Xtream Codes stream URLs and redirect to mock HLS.
 * Xtream URLs look like: /live/user/pass/streamid.m3u8 or /movie/user/pass/streamid.m3u8
 */
export async function interceptXtreamStream(page: Page): Promise<void> {
  await mockHlsStream(page);

  // Also intercept the actual stream URL patterns from the Xtream API
  await page.route(/\/(live|movie|series)\/.*\.(m3u8|ts)/, async (route) => {
    const url = route.request().url();
    if (url.endsWith(".m3u8")) {
      await route.fulfill({
        status: 200,
        contentType: "application/vnd.apple.mpegurl",
        body: MASTER_PLAYLIST,
      });
    } else if (url.endsWith(".ts")) {
      await route.fulfill({
        status: 200,
        contentType: "video/mp2t",
        body: createMinimalTsSegment(),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Mock a failing stream (for error recovery tests)
 */
export async function mockFailingStream(page: Page): Promise<void> {
  await page.route("**/*.m3u8", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "text/plain",
      body: "Service Unavailable",
    });
  });
}

/**
 * Remove all HLS route interceptions
 */
export async function unmockHlsStream(page: Page): Promise<void> {
  await page.unroute("**/*.m3u8");
  await page.unroute("**/*.ts");
}
