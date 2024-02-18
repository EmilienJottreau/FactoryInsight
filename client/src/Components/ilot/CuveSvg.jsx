import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function CuveSvg({ stationData }) {
  const [isFlameSombre, setIsFlameSombre] = useState(true);

  var level = 0;
  var agitator_state = false;
  var input_state = false
  var output_state = false
  var heating_state = false
  if(stationData){
      if (stationData.liquid_level) {
        level = stationData.liquid_level.value;
      }
    
      if (stationData.agitator_state) {
        agitator_state = !!+stationData.agitator_state.value;
      }
    
      if(stationData.input_state){
        input_state = !!+stationData.input_state.value
      }

      if(stationData.output_state){
        output_state = !!+stationData.output_state.value
      }

      if(stationData.heating_state){
        heating_state = !!+stationData.heating_state.value
      }

  }

  



  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlameSombre(!isFlameSombre);
    }, 2000);
    return () => clearInterval(interval);
  }, [isFlameSombre]);



  return (
    <>
      <svg
        width={543}
        height={775}
        viewBox="-120 0 723 775"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="cuveSvg"
      >
        <g id="Group 16">
          <circle
            id="Indicator_Output"
            cx="561.5"
            cy="551.5"
            r="37.5"
            fill={output_state ? "#5ea34a":"#dc7971"}
            
          />
          <circle
            id="Indicator_Input"
            cx="-56.5"
            cy="37.5"
            r="37.5"
            fill={input_state ? "#5ea34a":"#dc7971"}
          />
          <g id="Cuve _redesign">
            <rect
              id="Pied_Gauche"
              x={121.492}
              y={446}
              width={55.8395}
              height={240.647}
              rx={27.9197}
              transform="rotate(8 121.492 446)"
              fill="#989898"
            />
            <g id="Core">
              <rect
                id="Rectangle 31"
                x={88}
                y={66}
                width={434}
                height={437}
                rx={80}
                fill="#D9D9D9"
              />
              <path
                id="Subtract"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M387.053 503H442C486.183 503 522 467.183 522 423V146C522 101.817 486.183 66 442 66H387.053C431.236 66 467.053 101.817 467.053 146V423C467.053 467.183 431.236 503 387.053 503Z"
                fill="#CCCCCC"
              />
            </g>
            <g id="Bottom">
              <g id="Group 13">
                <path
                  id="Polygon 1"
                  d="M304.5 622L112.675 481.75H496.325L304.5 622Z"
                  fill="#BDBDBD"
                />
                <path
                  id="Subtract_2"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M439.939 482L268 605.951L296.903 627L496 482H439.939Z"
                  fill="#A1A1A1"
                />
              </g>
              <g id="button">
                <path
                  id="Subtract_3"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M245.374 578C244.478 581.349 244 584.869 244 588.5C244 610.868 262.132 629 284.5 629H325.5C347.868 629 366 610.868 366 588.5C366 584.869 365.522 581.349 364.626 578H245.374Z"
                  fill="#D9D9D9"
                />
                <path
                  id="Subtract_4"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M307 629H325.5C347.868 629 366 610.868 366 588.5C366 584.869 365.522 581.349 364.626 578H307V629Z"
                  fill="#CCCCCC"
                />
              </g>
            </g>
            <g id="Input_Pipe">
              <path
                id="Union"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 0H36V88C36 92.4183 39.5817 96 44 96H132V128H36C18.3269 128 4 113.673 4 96V0Z"
                fill="#E05252"
              />
              <g id="Group 9">
                <rect
                  id="Rectangle 43"
                  y={2}
                  width={40}
                  height={10}
                  rx={5}
                  fill="#7A1F1F"
                />
                <rect
                  id="Rectangle 44"
                  y={20}
                  width={40}
                  height={10}
                  rx={5}
                  fill="#7A1F1F"
                />
                <rect
                  id="Rectangle 45"
                  y={38}
                  width={40}
                  height={10}
                  rx={5}
                  fill="#7A1F1F"
                />
                <rect
                  id="Rectangle 46"
                  y={56}
                  width={40}
                  height={10}
                  rx={5}
                  fill="#7A1F1F"
                />
                <rect
                  id="Rectangle 47"
                  y={74}
                  width={40}
                  height={10}
                  rx={5}
                  fill="#7A1F1F"
                />
              </g>
              <g id="Group 10">
                <rect
                  id="Rectangle 50"
                  x={46}
                  y={132.02}
                  width={40}
                  height={10}
                  rx={5}
                  transform="rotate(-90 46 132.02)"
                  fill="#7A1F1F"
                />
                <rect
                  id="Rectangle 51"
                  x={64}
                  y={132.015}
                  width={40}
                  height={10}
                  rx={5}
                  transform="rotate(-90 64 132.015)"
                  fill="#7A1F1F"
                />
                <rect
                  id="Rectangle 52"
                  x={82}
                  y={132.01}
                  width={40}
                  height={10}
                  rx={5}
                  transform="rotate(-90 82 132.01)"
                  fill="#7A1F1F"
                />
                <rect
                  id="Rectangle 53"
                  x={100}
                  y={132.005}
                  width={40}
                  height={10}
                  rx={5}
                  transform="rotate(-90 100 132.005)"
                  fill="#7A1F1F"
                />
                <rect
                  id="Rectangle 54"
                  x={118}
                  y={132}
                  width={40}
                  height={10}
                  rx={5}
                  transform="rotate(-90 118 132)"
                  fill="#7A1F1F"
                />
              </g>
            </g>
            <g id="Output_Pipe">
              <path
                id="Union_2"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M382 518H414V606C414 610.418 417.582 614 422 614H543V646H414C396.327 646 382 631.673 382 614V518Z"
                fill="#9970C2"
              />
              <g id="Group 11">
                <rect
                  id="Rectangle 43_2"
                  x={378}
                  y={520}
                  width={40}
                  height={10}
                  rx={5}
                  fill="#4D2E6B"
                />
                <rect
                  id="Rectangle 44_2"
                  x={378}
                  y={538}
                  width={40}
                  height={10}
                  rx={5}
                  fill="#4D2E6B"
                />
                <rect
                  id="Rectangle 45_2"
                  x={378}
                  y={556}
                  width={40}
                  height={10}
                  rx={5}
                  fill="#4D2E6B"
                />
                <rect
                  id="Rectangle 46_2"
                  x={378}
                  y={574}
                  width={40}
                  height={10}
                  rx={5}
                  fill="#4D2E6B"
                />
                <rect
                  id="Rectangle 47_2"
                  x={378}
                  y={592}
                  width={40}
                  height={10}
                  rx={5}
                  fill="#4D2E6B"
                />
              </g>
              <g id="Group 12">
                <rect
                  id="Rectangle 50_2"
                  x={424}
                  y={650.02}
                  width={40}
                  height={10}
                  rx={5}
                  transform="rotate(-90 424 650.02)"
                  fill="#4D2E6B"
                />
                <rect
                  id="Rectangle 51_2"
                  x={442}
                  y={650.015}
                  width={40}
                  height={10}
                  rx={5}
                  transform="rotate(-90 442 650.015)"
                  fill="#4D2E6B"
                />
                <rect
                  id="Rectangle 52_2"
                  x={460}
                  y={650.01}
                  width={40}
                  height={10}
                  rx={5}
                  transform="rotate(-90 460 650.01)"
                  fill="#4D2E6B"
                />
                <rect
                  id="Rectangle 53_2"
                  x={478}
                  y={650.005}
                  width={40}
                  height={10}
                  rx={5}
                  transform="rotate(-90 478 650.005)"
                  fill="#4D2E6B"
                />
                <rect
                  id="Rectangle 54_2"
                  x={496}
                  y={650}
                  width={40}
                  height={10}
                  rx={5}
                  transform="rotate(-90 496 650)"
                  fill="#4D2E6B"
                />
                <rect
                  id="Rectangle 55"
                  x={514}
                  y={650}
                  width={40}
                  height={10}
                  rx={5}
                  transform="rotate(-90 514 650)"
                  fill="#4D2E6B"
                />
                <rect
                  id="Rectangle 56"
                  x={532}
                  y={650}
                  width={40}
                  height={10}
                  rx={5}
                  transform="rotate(-90 532 650)"
                  fill="#4D2E6B"
                />
              </g>
            </g>
            <path
              id="Pied_Droit"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M442.466 521.128L493.6 483.742L517.902 656.656C520.048 671.926 509.409 686.044 494.14 688.19C478.87 690.336 464.752 679.697 462.606 664.428L442.466 521.128Z"
              fill="#989898"
            />
            <rect
              id="Bandeau"
              x={75}
              y={139}
              width={456}
              height={32}
              rx={16}
              fill="#BDBDBD"
            />
            <g id="Fond">
              <g id="Rectangle" filter="url(#a)">
                <rect x={163} y={112} width={285} height={364} fill="#D6D6D6" />
              </g>
              <g id="Barreau">
                <rect
                  id="Rectangle 62"
                  x={163}
                  y={112}
                  width={285}
                  height={6.38596}
                  fill="#959595"
                  fillOpacity={0.1}
                />
                <rect
                  id="Rectangle 63"
                  x={163}
                  y={129.029}
                  width={285}
                  height={6.38596}
                  fill="#959595"
                  fillOpacity={0.1}
                />
                <rect
                  id="Rectangle 64"
                  x={163}
                  y={146.058}
                  width={285}
                  height={6.38596}
                  fill="#959595"
                  fillOpacity={0.1}
                />
                <rect
                  id="Rectangle 65"
                  x={163}
                  y={163.088}
                  width={285}
                  height={6.38596}
                  fill="#959595"
                  fillOpacity={0.1}
                />
                <rect
                  id="Rectangle 66"
                  x={163}
                  y={180.117}
                  width={285}
                  height={6.38596}
                  fill="#959595"
                  fillOpacity={0.1}
                />
                <rect
                  id="Rectangle 67"
                  x={163}
                  y={197.146}
                  width={285}
                  height={6.38596}
                  fill="#959595"
                  fillOpacity={0.1}
                />
                <rect
                  id="Rectangle 68"
                  x={163}
                  y={214.176}
                  width={285}
                  height={6.38596}
                  fill="#959595"
                  fillOpacity={0.1}
                />
                <rect
                  id="Rectangle 69"
                  x={163}
                  y={231.205}
                  width={285}
                  height={6.38596}
                  fill="#959595"
                  fillOpacity={0.1}
                />
                <rect
                  id="Rectangle 70"
                  x={163}
                  y={248.234}
                  width={285}
                  height={6.38596}
                  fill="#959595"
                  fillOpacity={0.1}
                />
                <rect
                  id="Rectangle 71"
                  x={163}
                  y={265.263}
                  width={285}
                  height={6.38596}
                  fill="#959595"
                  fillOpacity={0.1}
                />
                <rect
                  id="Rectangle 72"
                  x={163}
                  y={282.292}
                  width={285}
                  height={6.38596}
                  fill="#959595"
                  fillOpacity={0.1}
                />
                <rect
                  id="Rectangle 73"
                  x={163}
                  y={299.322}
                  width={285}
                  height={6.38596}
                  fill="#959595"
                  fillOpacity={0.1}
                />
                <rect
                  id="Rectangle 74"
                  x={163}
                  y={316.351}
                  width={285}
                  height={6.38596}
                  fill="#959595"
                  fillOpacity={0.1}
                />
                <rect
                  id="Rectangle 75"
                  x={163}
                  y={333.38}
                  width={285}
                  height={6.38596}
                  fill="#959595"
                  fillOpacity={0.1}
                />
                <rect
                  id="Rectangle 76"
                  x={163}
                  y={350.409}
                  width={285}
                  height={6.38596}
                  fill="#959595"
                  fillOpacity={0.1}
                />
                <rect
                  id="Rectangle 77"
                  x={163}
                  y={367.439}
                  width={285}
                  height={6.38596}
                  fill="#959595"
                  fillOpacity={0.1}
                />
                <rect
                  id="Rectangle 78"
                  x={163}
                  y={384.468}
                  width={285}
                  height={6.38596}
                  fill="#959595"
                  fillOpacity={0.1}
                />
                <rect
                  id="Rectangle 79"
                  x={163}
                  y={401.497}
                  width={285}
                  height={6.38596}
                  fill="#959595"
                  fillOpacity={0.1}
                />
                <rect
                  id="Rectangle 80"
                  x={163}
                  y={418.526}
                  width={285}
                  height={6.38596}
                  fill="#959595"
                  fillOpacity={0.1}
                />
                <rect
                  id="Rectangle 81"
                  x={163}
                  y={435.556}
                  width={285}
                  height={6.38596}
                  fill="#959595"
                  fillOpacity={0.1}
                />
                <rect
                  id="Rectangle 82"
                  x={163}
                  y={452.585}
                  width={285}
                  height={6.38596}
                  fill="#959595"
                  fillOpacity={0.1}
                />
                <rect
                  id="Rectangle 83"
                  x={163}
                  y={469.614}
                  width={285}
                  height={6.38596}
                  fill="#959595"
                  fillOpacity={0.1}
                />
              </g>
            </g>
            <rect
              id="Liquid"
              x={163}
              y={-182 * level + 476}
              width={285}
              height={182 * level}
              fill="#4BA4E4"
              fillOpacity={0.69}
            />
            <g id="Agitateur">
              <rect
                id="Rectangle 86"
                x={295.682}
                y={112}
                width={16.2727}
                height={262.727}
                fill="#82cf3a"
              />
              {agitator_state ? (
                <motion.path
                  animate={{ rotateY: 360, rotateX: 10 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                  id="Lame"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M316.701 356.15C326.555 361.077 332.091 367.759 332.091 374.727L332.091 374.727L384.636 374.727C384.636 381.695 379.1 388.378 369.246 393.305C359.392 398.232 346.027 401 332.091 401C318.155 401 304.79 398.232 294.936 393.305C285.082 388.378 279.546 381.695 279.546 374.727H279.545L227 374.727C227 367.759 232.536 361.077 242.39 356.15C252.244 351.223 265.61 348.455 279.545 348.455C293.481 348.455 306.847 351.223 316.701 356.15Z"
                  fill="#82cf3a"
                />
              ) : (
                <path
                  id="Lame"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M316.701 356.15C326.555 361.077 332.091 367.759 332.091 374.727L332.091 374.727L384.636 374.727C384.636 381.695 379.1 388.378 369.246 393.305C359.392 398.232 346.027 401 332.091 401C318.155 401 304.79 398.232 294.936 393.305C285.082 388.378 279.546 381.695 279.546 374.727H279.545L227 374.727C227 367.759 232.536 361.077 242.39 356.15C252.244 351.223 265.61 348.455 279.545 348.455C293.481 348.455 306.847 351.223 316.701 356.15Z"
                  fill="#82cf3a"
                />
              )}
            </g>
          </g>

          <g id="FlameSombre">
            <path
              id="Flame"
              d="M305 671C272.727 692.016 256.52 746 305 746C353.48 746 337.273 692.016 305 671Z"
              fill="#FF9601"
            />
            <g id="Inner" filter="url(#b)">
              <path
                id="Inner Base"
                d="M305 741C279.5 741 297.5 709 305 705C312.5 709 330.5 741 305 741Z"
                fill="#FFB803"
              />
              <path
                id="Inner 01"
                d="M305 741C290.5 741.5 286.305 727.262 290.5 719C293.477 726.774 306.919 733.667 305 741Z"
                fill="#FFB803"
              />
              <path
                id="Inner 02"
                d="M310.194 740.071C324.274 736.571 320.774 723.721 316.93 713.451C312.952 720.709 306.336 733.546 310.194 740.071Z"
                fill="#FFB803"
              />
            </g>
          </g>
          {heating_state ? <g id="Particles">
            <motion.path
              animate={{  y: [0, -40] }}
              transition={{
                delay: 0,
                duration: 1,
                repeat: Infinity,
              }}
              id="Particle1"
              d="M287.5 666.199C289.642 664.365 291 661.641 291 658.6C291 655.558 289.642 652.834 287.5 651C285.358 652.834 284 655.558 284 658.6C284 661.641 285.358 664.365 287.5 666.199Z"
              fill="#FF9601"
            />
            <motion.path
              animate={{  y: [0, -40] }}
              transition={{
                delay: 0.66,
                duration: 1.8,
                repeat: Infinity,
              }}
              id="Particle2"
              d="M327.5 680.199C329.642 678.365 331 675.641 331 672.6C331 669.558 329.642 666.834 327.5 665C325.358 666.834 324 669.558 324 672.6C324 675.641 325.358 678.365 327.5 680.199Z"
              fill="#FF9601"
            />
            <motion.path
              animate={{ y: [0, -40] }}
              transition={{
                delay: 0.5,
                duration: 1.2,
                repeat: Infinity,
              }}
              id="Particle3"
              d="M318 659C319.836 657.673 321 655.701 321 653.5C321 651.299 319.836 649.327 318 648C316.164 649.327 315 651.299 315 653.5C315 655.701 316.164 657.673 318 659Z"
              fill="#FF9601"
            />
            <motion.path
              animate={{     y: [0, -40] }}
              transition={{
                delay: 0.99,
                duration: 1,
                repeat: Infinity,
              }}
              id="Particle4"
              d="M303.5 646C305.03 645.035 306 643.601 306 642C306 640.399 305.03 638.965 303.5 638C301.97 638.965 301 640.399 301 642C301 643.601 301.97 645.035 303.5 646Z"
              fill="#FF9601"
            />
          </g> : <></>}
        </g>
        <defs>
          <filter
            id="a"
            width={285}
            height={364}
            x={163}
            y={112}
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset />
            <feGaussianBlur stdDeviation={2} />
            <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend in2="shape" result="effect1_innerShadow_72_5709" />
          </filter>
          <filter
            id="b"
            width={39.418}
            height={44.013}
            x={284.956}
            y={705}
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dy={4} />
            <feGaussianBlur stdDeviation={2} />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend
              in2="BackgroundImageFix"
              result="effect1_dropShadow_72_5709"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_72_5709"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
}
