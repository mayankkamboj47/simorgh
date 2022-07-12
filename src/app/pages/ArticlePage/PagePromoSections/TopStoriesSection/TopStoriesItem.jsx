import React, { useContext } from 'react';
import { ServiceContext } from '#contexts/ServiceContext';
import { shape, number } from 'prop-types';
import pathOr from 'ramda/src/pathOr';
import isEmpty from 'ramda/src/isEmpty';
import { storyItem } from '#models/propTypes/storyItem';
import { getIsLive } from '#lib/utilities/getStoryPromoInfo';
import Promo from '#components/OptimoPromos';
import { StyledPromoHeading, StyledTimestamp } from './index.styles';
import optimoPromoIdGenerator from '../utility';

const TopStoriesItem = ({ item, index }) => {
  const { script, translations } = useContext(ServiceContext);

  if (!item || isEmpty(item)) return null;

  const eventTrackingData = {
    block: {
      componentName: 'top-stories',
    },
  };

  const overtypedHeadline = pathOr('', ['headlines', 'overtyped'], item);
  const headline =
    overtypedHeadline ||
    pathOr('', ['headlines', 'headline'], item) ||
    pathOr('', ['name'], item);

  const mediaType = pathOr(null, ['media', 'format'], item);
  const mediaDuration = pathOr(null, ['media', 'duration'], item);
  const isPhotoGallery = pathOr(null, ['cpsType'], item) === 'PGL';

  const timestamp = pathOr(null, ['timestamp'], item);

  const assetUri = pathOr('', ['locators', 'assetUri'], item);
  const uri = pathOr('', ['uri'], item);

  const isLive = getIsLive(item);
  const contentType = pathOr('', ['contentType'], item);

  const liveLabel = pathOr('LIVE', ['media', 'liveLabel'], translations);

  // As screenreaders mispronounce the word 'LIVE', we use visually hidden
  // text to read 'Live' instead, which screenreaders pronounce correctly.
  const liveLabelIsEnglish = liveLabel === 'LIVE';

  const linkId = optimoPromoIdGenerator(
    'top-stories',
    assetUri,
    uri,
    contentType,
    index,
  );

  const headingTagOverride = timestamp ? '' : 'div';

  return (
    <Promo
      toLink={assetUri || uri}
      a11yId={linkId}
      mediaType={mediaType}
      eventTrackingData={eventTrackingData}
    >
      <Promo.ContentWrapper>
        {mediaType && <Promo.MediaIndicator />}
        <StyledPromoHeading
          script={script}
          headingTagOverride={headingTagOverride}
        >
          <Promo.Link>
            {isLive ? (
              <Promo.LiveLabel
                liveText={liveLabel}
                ariaHidden={liveLabelIsEnglish}
                offScreenText={liveLabelIsEnglish ? 'Live' : null}
              >
                <Promo.Content
                  mediaDuration={mediaDuration}
                  headline={headline}
                  isPhotoGallery={isPhotoGallery}
                />
              </Promo.LiveLabel>
            ) : (
              <Promo.Content
                mediaDuration={mediaDuration}
                headline={headline}
                isPhotoGallery={isPhotoGallery}
              />
            )}
          </Promo.Link>
        </StyledPromoHeading>
        <StyledTimestamp>{timestamp}</StyledTimestamp>
      </Promo.ContentWrapper>
    </Promo>
  );
};

TopStoriesItem.propTypes = {
  item: shape(storyItem).isRequired,
  index: number,
};

TopStoriesItem.defaultProps = { index: null };

export default TopStoriesItem;