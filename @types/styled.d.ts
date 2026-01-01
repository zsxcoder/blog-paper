// import original module declarations
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    mode: 'light' | 'dark' | 'system',
    assets: {
      favico: string,
    },
    colors: {
      [x: string]: Interpolation<FastOmit<DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>, never>>;
      [x: string]: Interpolation<FastOmit<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>, never>>;
      [x: string]: Interpolation<Substitute<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, { $copied: boolean; }>>;
      text: Interpolation<FastOmit<DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>, never>>;
      textPrimary: string,
      textSecondary: string,
      textGray: string,
      textGray2: string,
      textGray3: string,
      accent: string,
      accentHover: string,
      bg: string,
      bg2: string,
      bgInverse: string,
      bgMask: string;
      bgFilter: "multiply" | "screen";
      tagBg: string
      floatBg: string,
      hoverBg: string,
      codeBlockBg: string,
      shadowBg: string,
      maskGradient: FlattenSimpleInterpolation,
      navBgGradient: FlattenInterpolation,
      filterDarker?: FlattenSimpleInterpolation,
      uiLineGray: string,
      uiLineGray2: string,
      uiLineGray3: string,
    },
  }
}