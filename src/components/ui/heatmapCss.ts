import {rainbowColors} from "../../theme/colours";

export function injectRainbowCss() {
    const style = document.createElement('style');
    style.innerHTML = `
    .rainbow_bar_animated .rt-ProgressIndicator {
        background: linear-gradient(to right, ${rainbowColors.join(', ')});
        animation: rainbow-animation 3s linear infinite;
        background-size: 200% 100%;
        background-repeat: repeat;
    }`
    document.head.appendChild(style);
}

export function injectHeatmapCss() {
    const style = document.createElement('style');
    style.innerHTML = `
      .react-datepicker__day--highlighted-regular,
      .react-datepicker__day--highlighted-regular:hover {
        background: var(--accent-9);
        border-radius: 0.3rem;
        color: white;
      }

      .react-datepicker__day--highlighted-perfect,
      .react-datepicker__day--highlighted-perfect:hover {
        background: linear-gradient(to right bottom, ${rainbowColors.join(',')});
        border-radius: 0.3rem;
        color: white;
        font-weight: bold;
      }
    `;
    document.head.appendChild(style);
}
