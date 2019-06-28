import React from 'react';
import Helmet from 'react-helmet';
import deepGet from '../../lib/utilities/deepGet';
import Canonical from './Canonical';
import Caption from '../Caption';
import videoMetadata from './audioVideoMetadata';
import {
  NestedGridParentLarge,
  NestedGridParentSmall,
  NestedGridItemChildSmall,
  NestedGridItemChildLarge,
  GridItemConstrainedLargeNoMargin,
  GridItemConstrainedSmall,
} from '../../lib/styledGrid';

import {
  audioVideoPropTypes,
  emptyBlockArrayDefaultProps,
} from '../../models/propTypes';
import filterForBlockType from '../../lib/utilities/blockHandlers';
import { RequestContext } from '../../contexts/RequestContext';

const AudioVideoContainer = ({ blocks }) => {
  const { platform } = React.useContext(RequestContext);

  if (!blocks) {
    return null;
  }

  const aresMediaBlock = filterForBlockType(blocks, 'aresMedia');

  if (!aresMediaBlock) {
    return null;
  }

  const metadata = videoMetadata(aresMediaBlock);
  const captionBlock = filterForBlockType(blocks, 'caption');
  const nestedModel = deepGet(['model', 'blocks', 0, 'model'], aresMediaBlock);
  const pid = deepGet(['id'], nestedModel);
  const kind =
    deepGet(['format'], nestedModel) === 'audio_video' ? 'programme' : 'audio';

  const type = kind === 'audio' ? kind : 'video';

  const orientation = deepGet(['versions', 0, 'types', 0], nestedModel);

  const wrapperSpan = {
    default: '6',
    group5: '12',
  };
  let ParentWrapper = NestedGridParentLarge;
  let ChildWrapper = NestedGridItemChildLarge;
  let Container = GridItemConstrainedLargeNoMargin;

  if (orientation === 'Portrait') {
    ParentWrapper = NestedGridParentSmall;
    ChildWrapper = NestedGridItemChildSmall;
    Container = GridItemConstrainedSmall;
    wrapperSpan.default = '4';
  }

  return (
    <Container>
      {metadata ? (
        <Helmet>
          {
            <script type="application/ld+json">
              {JSON.stringify(metadata)}
            </script>
          }
        </Helmet>
      ) : null}
      <ParentWrapper>
        <ChildWrapper gridColumnStart={1} gridSpan={wrapperSpan}>
          {platform === 'canonical' ? (
            <Canonical id={pid} blocks={blocks} />
          ) : null}
        </ChildWrapper>
        <ChildWrapper
          gridColumnStart={1}
          gridSpan={{
            default: '6',
            group3: '5',
            group4: '5',
            group5: '10',
          }}
        >
          {captionBlock ? <Caption block={captionBlock} type={type} /> : null}
        </ChildWrapper>
      </ParentWrapper>
    </Container>
  );
};

AudioVideoContainer.propTypes = audioVideoPropTypes;

AudioVideoContainer.defaultProps = emptyBlockArrayDefaultProps;

export default AudioVideoContainer;
