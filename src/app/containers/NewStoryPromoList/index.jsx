import { GEL_SPACING_DBL } from '#app/legacy/gel-foundations/src/spacings';
import styled from '@emotion/styled';

// Bases
export const StoryPromoLiBase = styled.li`
  margin-bottom: ${GEL_SPACING_DBL};
  &:last-child {
    margin: 0;
  }
`;

StoryPromoLiBase.defaultProps = { role: 'listitem' };

export const StoryPromoUlBase = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

StoryPromoUlBase.defaultProps = {
  role: 'list',
};