import React, { useState } from 'react';

const CANVAS_SIZE = 1200;
const CENTER = CANVAS_SIZE / 2;
const BASE_RADIUS = 200;
const NODE_RADIUS = 25;
const CHAIN_SPACING = 80;

const SkillTreeGraph = () => {
  const [expandedNodes, setExpandedNodes] = useState(new Set(["Start"]));
  const [completedNodes, setCompletedNodes] = useState(new Set());
  const [hoveredNode, setHoveredNode] = useState(null);

  const skillTreeData = {
    name: "Start",
    children: [
      {
        name: "Health",
        emoji: "🏋️‍♂️",
        direction: "right",
        children: [
          {
            name: "Road to Marathon Glory 🏃",
            children: [
              { name: "Run 1km" },
              { name: "Run 10km" },
              { name: "Run 21km" },
              { name: "Run 42km" }
            ]
          },
          {
            name: "Bodyweight Mastery 💪",
            children: [
              {
                name: "Push-ups 👊",
                children: [
                  { name: "Do 10 push ups" },
                  { name: "Do 100 push ups in a day" }
                ]
              },
              {
                name: "Bar Mastery 🏋️",
                children: [
                  { name: "Do 1 pullup" },
                  { name: "Do 10 pullups" },
                  { name: "Do a muscle up" }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "Wealth",
        emoji: "💰",
        direction: "top",
        children: [
          {
            name: "Financial Foundations 🏠",
            children: [
              { name: "$1" },
              { name: "$100" },
              { name: "$1,000" },
              { name: "$10,000" },
              { name: "$100,000" },
              { name: "$1,000,000" },
              { name: "$10,000,000" },
              { name: "$100,000,000" },
              { name: "$1,000,000,000" }
            ]
          }
        ]
      },
      {
        name: "Wisdom",
        emoji: "📚",
        direction: "left",
        children: [
          {
            name: "Reading Odyssey 📖",
            children: [
              { name: "Read 1 book" },
              { name: "Read 100 books" },
              { name: "Read 500 books" },
              { name: "Read 1,000 books" }
            ]
          },
          {
            name: "Author's Journey ✍️",
            children: [
              { name: "Write 1 book" },
              { name: "Write 5 books" }
            ]
          },
          {
            name: "Blogging 💻",
            children: [
              { name: "Write 1 blog post" },
              { name: "Write 10 blog posts" },
              { name: "Write 50 blog posts" },
              { name: "Write 100 blog posts" }
            ]
          }
        ]
      },
      {
        name: "Explore",
        emoji: "🌍",
        direction: "bottom",
        children: [
          {
            name: "Continental Conqueror 🗺️",
            children: [
              { name: "Visit 2 continents" },
              { name: "Visit 4 continents" },
              { name: "Visit all 7 continents" }
            ]
          },
          {
            name: "Global Adventurer 🧭",
            children: [
              { name: "Visit 4 countries" },
              { name: "Visit 10 countries" },
              { name: "Visit 20 countries" },
              { name: "Visit 40 countries" },
              { name: "Visit 100 countries" }
            ]
          },
          {
            name: "Career 💼",
            children: [
              { name: "Get an internship" },
              { name: "Get a full-time job" },
              { name: "Get a promotion" },
              { name: "Lead a project" },
              { name: "Become a manager" },
              { name: "Start a company" },
              { name: "Give a keynote speech" }
            ]
          },
          {
            name: "Go-offline 🌴",
            children: [
              { name: "Take 1 tech-free day" },
              { name: "Take 2 tech-free days" },
              { name: "Take 7 tech-free days" }
            ]
          }
        ]
      }
    ]
  };

  const calculatePosition = (direction, level, index, totalChildren, parentPos) => {
    if (level <= 1) {
      const baseAngle = direction === "right" ? 0 :
                        direction === "top" ? Math.PI / 2 :
                        direction === "left" ? Math.PI :
                        3 * Math.PI / 2;
      
      const radius = BASE_RADIUS + (level * NODE_RADIUS * 2);
      const arcLength = Math.PI / 2;
      const angleStep = arcLength / (totalChildren + 1);
      const nodeAngle = baseAngle - arcLength / 2 + angleStep * (index + 1);
      
      return {
        x: CENTER + radius * Math.cos(nodeAngle),
        y: CENTER + radius * Math.sin(nodeAngle)
      };
    } else {
      // Chain-like positioning for deeper levels
      const angle = direction === "right" ? 0 :
                    direction === "top" ? Math.PI / 2 :
                    direction === "left" ? Math.PI :
                    3 * Math.PI / 2;
      
      return {
        x: parentPos.x + CHAIN_SPACING * Math.cos(angle),
        y: parentPos.y + CHAIN_SPACING * Math.sin(angle)
      };
    }
  };

  const toggleNodeExpansion = (nodeName) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeName)) {
        newSet.delete(nodeName);
      } else {
        newSet.add(nodeName);
      }
      return newSet;
    });
  };

  const toggleNodeCompletion = (nodeName) => {
    setCompletedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeName)) {
        newSet.delete(nodeName);
      } else {
        newSet.add(nodeName);
      }
      return newSet;
    });
  };

  const renderNode = (node, x, y, level) => (
    <g key={node.name}>
      <circle
        cx={x}
        cy={y}
        r={NODE_RADIUS}
        fill={completedNodes.has(node.name) ? "#4CAF50" : 
              hoveredNode === node.name ? "#FFA500" : "#2196F3"}
        stroke="#333"
        strokeWidth="2"
        onClick={() => toggleNodeCompletion(node.name)}
        onMouseEnter={() => setHoveredNode(node.name)}
        onMouseLeave={() => setHoveredNode(null)}
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize={NODE_RADIUS / 2}
      >
        {node.emoji || node.name.slice(0, 2)}
      </text>
      {node.children && node.children.length > 0 && (
        <circle
          cx={x + NODE_RADIUS * 0.7}
          cy={y - NODE_RADIUS * 0.7}
          r={NODE_RADIUS / 3}
          fill={expandedNodes.has(node.name) ? "#FFA500" : "#2196F3"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => toggleNodeExpansion(node.name)}
        />
      )}
    </g>
  );

  const renderBranch = (start, end) => (
    <line
      x1={start.x}
      y1={start.y}
      x2={end.x}
      y2={end.y}
      stroke="#333"
      strokeWidth="2"
    />
  );

  const renderTree = (node, x, y, level = 0, direction = null, index = 0, totalChildren = 1, parentPos = null) => {
    const nodeElements = [renderNode(node, x, y, level)];
    
    if (node.children && expandedNodes.has(node.name)) {
      node.children.forEach((child, i) => {
        const childPos = calculatePosition(direction || child.direction, level + 1, i, node.children.length, {x, y});
        nodeElements.push(renderBranch({x, y}, childPos));
        nodeElements.push(...renderTree(child, childPos.x, childPos.y, level + 1, direction || child.direction, i, node.children.length, {x, y}));
      });
    }
    
    return nodeElements;
  };

  return (
    <svg width={CANVAS_SIZE} height={CANVAS_SIZE}>
      {renderTree(skillTreeData, CENTER, CENTER)}
    </svg>
  );
};

export default SkillTreeGraph;
