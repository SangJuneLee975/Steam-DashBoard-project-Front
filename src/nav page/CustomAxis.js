import React from 'react';

const CustomAxis = ({ x, y, payload, games }) => {
  const game = games.find((game) => game.appid === payload.value);

  return (
    <g transform={`translate(${x},${y})`}>
      <image
        href={`http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
        x={-12}
        y={9}
        height={18}
        width={18}
      />
      <text x={0} y={0} dy={7} textAnchor="middle" fill="#666">
        {game.name.length > 20 ? game.name.slice(0, 18) + '...' : game.name}{' '}
        {/* x축 텍스트 길이를 제한 */}
      </text>
    </g>
  );
};

export default CustomAxis;
