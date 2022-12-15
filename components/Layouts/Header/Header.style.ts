import styled from "@emotion/styled";

export const Container = styled.header<{ triggerHide: boolean }>`
  font-size: 18px;
  padding: 2em 0;

  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  transform: translate3d(
    0,
    ${(props) => (props.triggerHide ? "-100%" : "0")},
    0
  );
  transition: transform
    ${(props) =>
      props.triggerHide
        ? "0.5s cubic-bezier(0.2, 0, 0, 1)"
        : "0.3s cubic-bezier(0, 0, 0, 1)"};
  transition-delay: 0.4s;

  .logo {
    ${({ theme }) => theme.shareCSS.noDrag};

    display: flex;
    gap: 0.11em;

    font-family: "Raleway", sans-serif;
    font-weight: 600;
    letter-spacing: 0.3px;

    .word {
      padding: 0.16em 0.33em;
      line-height: 1em;

      &.right {
        background-color: white;
        color: #212121;
      }
    }
  }

  @media screen and (max-width: ${({ theme }) =>
      theme.responsiveSizes.mobile}px) {
    font-size: 15px;
  }
`;
