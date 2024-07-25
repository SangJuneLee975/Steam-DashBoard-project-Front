import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

const WordCloud = () => {
  const { appid } = useParams();
  const [words, setWords] = useState([]);
  const svgRef = useRef();

  const stopWords = new Set([
    'a',
    'an',
    'the',
    'and',
    'or',
    'but',
    'is',
    'are',
    'was',
    'were',
    'in',
    'on',
    'at',
    'of',
    'for',
    'with',
    'to',
    'from',
    'by',
    'as',
    'that',
    'this',
    'it',
    'be',
    'has',
    'have',
    'had',
    'will',
    'would',
    'can',
    'could',
    'should',
    'just',
    'because',
    'much',
    'so',
    'some',
    'we',
    'he',
    'she',
    'they',
    'you',
    'i',
    'my',
    'your',
    'our',
    'their',
    'if',
    'then',
    'than',
    'too',
    'very',
    'really',
    'game',
    'time',
    'play',
  ]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get(`/steam/reviews`, {
          params: { appId: appid },
        });
        const reviews = response.data;

        const wordCounts = reviews.reduce((acc, review) => {
          review.split(' ').forEach((word) => {
            // 단어를 소문자로 변환하고, 불필요한 기호 제거
            word = word.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
            if (!stopWords.has(word.toLowerCase())) {
              acc[word] = (acc[word] || 0) + 1;
            }
          });
          return acc;
        }, {});

        let formattedWords = Object.entries(wordCounts)
          .map(([text, size]) => ({ text, size }))
          .filter((word) => word.size > 1) // 단어 빈도수가 1보다 큰 것만 필터링
          .sort((a, b) => b.size - a.size); // 빈도수 기준으로 정렬

        formattedWords = formattedWords.slice(0, 100); // 상위 100개의 단어만 사용

        setWords(formattedWords);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [appid]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 1000;
    const height = 500;

    const layout = cloud()
      .size([width, height])
      .words(words.map((d) => ({ text: d.text, size: d.size * 5 }))) // 단어 크기 조절
      .padding(10) // 단어 간격을 넓힘
      .rotate(() => 0) // 회전을 없애서 글자가 겹치지 않도록 함
      .font('Impact')
      .fontSize((d) => d.size) // 글꼴 크기 설정
      .on('end', draw);

    layout.start();

    function draw(words) {
      svg
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`)
        .selectAll('text')
        .data(words)
        .enter()
        .append('text')
        .style('font-family', 'Impact')
        .style('font-size', (d) => `${d.size}px`)
        .style('fill', (d, i) => d3.schemeCategory10[i % 10])
        .attr('text-anchor', 'middle')
        .attr('transform', (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
        .text((d) => d.text);
    }
  }, [words]);

  return <svg ref={svgRef}></svg>;
};

export default WordCloud;
