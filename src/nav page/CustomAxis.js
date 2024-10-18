import React from 'react';

const CustomAxis = ({ x, y, payload, games }) => {
  const game = games.find((game) => game.appid === payload.value);

  return (
    <g transform={`translate(${x},${y})`}>
      <image
        href={`http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
        x={-21}
        y={16}
        height={48}
        width={48}
      />

      <rect
        x={-50}
        y={-5}
        width={200}
        height={20}
        fill="rgba(0, 0, 0, 0.5)" // 반투명한 검은색 배경
      />
      <text
        x={0}
        y={5}
        dy={7}
        textAnchor="middle"
        fill="white"
        fontSize={24}
        fontWeight="bold"
      >
        {game.name.length > 13 ? game.name.slice(0, 13) + '...' : game.name}{' '}
        {/* x축 텍스트 길이를 제한 */}
      </text>
    </g>
  );
};

export default CustomAxis;
