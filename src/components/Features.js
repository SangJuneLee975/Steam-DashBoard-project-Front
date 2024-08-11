import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import EdgesensorHighRoundedIcon from '@mui/icons-material/EdgesensorHighRounded';
import ViewQuiltRoundedIcon from '@mui/icons-material/ViewQuiltRounded';
import Stack from '@mui/material/Stack';
import styled from 'styled-components';

const items = [
  {
    icon: <ViewQuiltRoundedIcon />,
    title: '대시보드',
    description: '스팀 계정과 연동하여 개인 맞춤형 게임 정보를 제공합니다.',
    image: 'DashBoardimage.PNG',
    link: '/dashboard',
    imageStyles: { width: '100%', height: '100%', backgroundSize: 'cover' },
  },
  {
    icon: <EdgesensorHighRoundedIcon />,
    title: '게임 플레이 통계',
    description:
      '스팀 계정의 게임 플레이 시간을 그래프로 시각화하여 제공합니다.',
    image: 'GameViewimage.PNG',
    link: '/chart',
    imageStyles: { width: '80%', height: '80%', backgroundSize: 'contain' },
  },
  {
    icon: <DevicesRoundedIcon />,
    title: '게임목록',
    description: '스팀 계정에 등록된 모든 게임 목록을 확인할 수 있습니다.',
    image: 'GameListimage.PNG',
    link: '/gamelist',
    imageStyles: { width: '100%', height: '100%', backgroundSize: 'contain' },
  },
];

const IconContainer = styled.div`
  color: ${(props) =>
    props.selected
      ? props.theme.colors.secondary
      : props.theme.colors.textSecondary};
`;

const Title = styled.h3`
  color: ${(props) => props.theme.colors.main};
  font-size: 1.25em;
  margin: ${(props) => props.theme.spacing(2)}px 0 0 0;
`;

const Description = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 1em;
`;

const ImageContainer = styled.div`
  flex: 1;
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-position: center;
`;

export default function Features() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(null); // 초기값을 null로 주어서, 이미지가 상시 나오지 않게 설정
  const [hoveredItemIndex, setHoveredItemIndex] = React.useState(null);
  const navigate = useNavigate();

  // 항목 클릭 시 선택된 항목 설정
  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

  const handleCardClick = (link) => {
    navigate(link);
  };
  // 마우스를 메뉴에 올렸을 때
  const handleMouseEnter = (index) => {
    setHoveredItemIndex(index);
  };

  // 마우스를 메뉴에서 뗐을 때
  const handleMouseLeave = () => {
    setHoveredItemIndex(null);
  };

  const getBackgroundImage = () => {
    if (hoveredItemIndex !== null) {
      return `url(${process.env.PUBLIC_URL}/${items[hoveredItemIndex].image})`;
    } else if (selectedItemIndex !== null) {
      return `url(${process.env.PUBLIC_URL}/${items[selectedItemIndex].image})`;
    } else {
      return 'none';
    }
  };

  const getImageStyles = () => {
    if (hoveredItemIndex !== null) {
      return items[hoveredItemIndex].imageStyles;
    } else if (selectedItemIndex !== null) {
      return items[selectedItemIndex].imageStyles;
    } else {
      return { width: '100%', height: '100%', backgroundSize: 'cover' };
    }
  };

  return (
    <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="flex-start"
            spacing={2}
            useFlexGap
            sx={{ width: '100%', display: { xs: 'none', sm: 'flex' } }}
          >
            {items.map(({ icon, title, description, link }, index) => (
              <Card
                key={index}
                variant="outlined"
                component="div"
                onClick={() => handleCardClick(link)}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                sx={{
                  p: 3,
                  height: 'fit-content',
                  width: '100%',
                  background: 'none',
                  backgroundColor:
                    selectedItemIndex === index ? 'action.selected' : undefined,
                  borderColor: (theme) =>
                    theme.palette.mode === 'light'
                      ? selectedItemIndex === index
                        ? 'primary.light'
                        : 'grey.200'
                      : selectedItemIndex === index
                      ? 'primary.dark'
                      : 'grey.800',
                  cursor: 'pointer',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    textAlign: 'left',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { md: 'center' },
                    gap: 2.5,
                  }}
                >
                  <Box
                    sx={{
                      color: (theme) =>
                        theme.palette.mode === 'light'
                          ? selectedItemIndex === index
                            ? 'primary.main'
                            : 'grey.300'
                          : selectedItemIndex === index
                          ? 'primary.main'
                          : 'grey.700',
                    }}
                  >
                    {icon}
                  </Box>
                  <Box sx={{ textTransform: 'none' }}>
                    <Typography
                      color="text.primary"
                      variant="body2"
                      fontWeight="bold"
                    >
                      {title}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                      sx={{ my: 0.5 }}
                    >
                      {description}
                    </Typography>
                    <ChevronRightRoundedIcon
                      fontSize="small"
                      sx={{ mt: '1px', ml: '2px' }}
                    />
                  </Box>
                </Box>
              </Card>
            ))}
          </Stack>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: { xs: 'none', sm: 'flex' }, width: '100%' }}
        >
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <Box
              sx={{
                width: getImageStyles().width, // 항목별 이미지 크기 설정
                height: getImageStyles().height, // 항목별 이미지 크기 설정
                backgroundSize: getImageStyles().backgroundSize, // 항목별 이미지 크기 설정
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundImage: getBackgroundImage(),
              }}
            />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
