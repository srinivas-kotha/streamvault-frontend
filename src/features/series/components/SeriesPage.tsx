import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSpatialContainer, FocusContext } from '@shared/hooks/useSpatialNav';
import { usePageFocus } from '@shared/hooks/usePageFocus';
import { useSeriesByLanguage, type SeriesWithChannel } from '../api';
import { ContentRail } from '@shared/components/ContentRail';
import { FocusableCard } from '@shared/components/FocusableCard';
import { PageTransition } from '@shared/components/PageTransition';
import { isNewContent } from '@shared/utils/isNewContent';

export function SeriesPage() {
  const navigate = useNavigate();
  usePageFocus('SERIES_PAGE');
  const { ref: containerRef, focusKey } = useSpatialContainer({ focusKey: 'SERIES_PAGE', forceFocus: true });

  const { allSeries, channels, isLoading } = useSeriesByLanguage('Telugu');

  // Group series by channel, preserving channel order from the API
  const seriesByChannel = useMemo(() => {
    const grouped = new Map<string, { name: string; items: SeriesWithChannel[] }>();

    for (const ch of channels) {
      grouped.set(ch.id, { name: ch.name, items: [] });
    }

    for (const item of allSeries) {
      const group = grouped.get(item.channelId);
      if (group) {
        group.items.push(item);
      }
    }

    // Filter out empty channels
    return Array.from(grouped.entries())
      .filter(([, group]) => group.items.length > 0)
      .map(([id, group]) => ({ id, ...group }));
  }, [allSeries, channels]);

  return (
    <PageTransition>
      <FocusContext.Provider value={focusKey}>
        <div ref={containerRef} className="pt-4 pb-12 space-y-4">
          <h1 className="font-display text-2xl font-bold text-text-primary px-6 lg:px-10">
            Series
          </h1>

          {isLoading ? (
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <ContentRail key={i} title="" isLoading>
                  {null}
                </ContentRail>
              ))}
            </>
          ) : (
            seriesByChannel.map((channel) => (
              <ContentRail
                key={channel.id}
                title={channel.name}
                focusKey={`series-channel-${channel.id}`}
              >
                {channel.items.map((item) => (
                  <FocusableCard
                    key={item.series_id}
                    focusKey={`series-${item.series_id}`}
                    image={item.cover}
                    title={item.name}
                    aspectRatio="poster"
                    isNew={isNewContent(item.last_modified)}
                    onClick={() =>
                      navigate({
                        to: '/series/$seriesId',
                        params: { seriesId: String(item.series_id) },
                      })
                    }
                  />
                ))}
              </ContentRail>
            ))
          )}
        </div>
      </FocusContext.Provider>
    </PageTransition>
  );
}
