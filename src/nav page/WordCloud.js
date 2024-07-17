import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

const WordCloud = () => {
  const { appid } = useParams();
  const [words, setWords] = useState([]);
  const svgRef = useRef();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get(`/steam/reviews`, {
          params: { appId: appid },
        });
        const reviews = response.data;

        const wordCounts = reviews.reduce((acc, review) => {
          review.split(' ').forEach((word) => {
            acc[word] = (acc[word] || 0) + 1;
          });
          return acc;
        }, {});

        const formattedWords = Object.entries(wordCounts).map(
          ([text, size]) => ({ text, size })
        );
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
      .words(words.map((d) => ({ text: d.text, size: d.size })))
      .padding(5)
      .rotate(() => ~~(Math.random() * 2) * 90)
      .font('Impact')
      .fontSize((d) => d.size)
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
