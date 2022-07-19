import { C_GREY_10 } from '#app/legacy/psammead-styles/src/colours';
import { getSerifMedium } from '#app/legacy/psammead-styles/src/font-styles';
import styled from '@emotion/styled';

const StyledTitle = styled.span`
  color: ${C_GREY_10};
  margin: 0;
  ${({ service }) => getSerifMedium(service)}
`;

export default StyledTitle;
