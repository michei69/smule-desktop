export default function TypingAnimationSVG(props) {
  return <svg height={40} width={40} className="loader h-full shrink-0" {...props}>
    <defs>
      <style>
        {
          "\n        @keyframes blink {\n          50% {\n            fill: transparent\n          }\n        }\n  \n        .dot {\n          animation: 1s blink infinite;\n          fill: grey;\n        }\n  \n        .dot:nth-child(2) {\n          animation-delay: 250ms\n        }\n  \n        .dot:nth-child(3) {\n          animation-delay: 500ms\n        }\n      "
        }
      </style>
    </defs>
    <circle
      className="dot"
      cx={10}
      cy={20}
      r={3}
      style={{
        fill: "grey",
      }}
    />
    <circle
      className="dot"
      cx={20}
      cy={20}
      r={3}
      style={{
        fill: "grey",
      }}
    />
    <circle
      className="dot"
      cx={30}
      cy={20}
      r={3}
      style={{
        fill: "grey",
      }}
    />
  </svg>
};