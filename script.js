document.addEventListener("DOMContentLoaded", () => {
    const canvasContainer = document.getElementById("canvas-container");
    const canvas = document.getElementById("canvas");
    const resetButton = document.getElementById("reset-button");

    let isDragging = false;
    let startX, startY;
    let offsetX = 0, offsetY = 0;
    let scale = 1;

    // Fetch the skill tree data
    fetch('skill_treee.txt')
        .then(response => response.text())
        .then(data => {
            const skillTree = parseSkillTree(data);
            createNodes(skillTree);
            positionNodes(canvas.firstChild);
        });

    canvasContainer.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX - offsetX;
        startY = e.clientY - offsetY;
    });

    canvasContainer.addEventListener("mousemove", (e) => {
        if (isDragging) {
            offsetX = e.clientX - startX;
            offsetY = e.clientY - startY;
            updateTransform();
        }
    });

    canvasContainer.addEventListener("mouseup", () => {
        isDragging = false;
    });

    canvasContainer.addEventListener("wheel", (e) => {
        e.preventDefault();
        const scaleAmount = -e.deltaY * 0.001;
        scale += scaleAmount;
        scale = Math.min(Math.max(0.5, scale), 3); // Limit zoom levels
        updateTransform();
    });

    resetButton.addEventListener("click", () => {
        offsetX = 0;
        offsetY = 0;
        scale = 1;
        updateTransform();
    });

    function updateTransform() {
        canvas.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    }

    function parseSkillTree(data) {
        const lines = data.split('\n');
        const tree = { name: 'Start', children: [] };
        const stack = [tree];
    
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine) {
                const level = line.search(/\S|$/) / 2;
                const node = { name: trimmedLine.split('. ')[1], children: [] };
    
                while (stack.length > level + 1) {
                    stack.pop();
                }
    
                stack[stack.length - 1].children.push(node);
                stack.push(node);
            }
        });
    
        return tree;
    }
    
    function createNodes(tree, parent = null) {
        const node = document.createElement('div');
        node.className = 'node';
        node.innerHTML = `
            <span class="emoji">${getEmoji(tree.name)}</span>
            <span class="text">${tree.name}</span>
        `;
        canvas.appendChild(node);
    
        if (parent) {
            drawLine(parent, node);
        }
    
        tree.children.forEach(child => createNodes(child, node));
    }
    
    function getEmoji(name) {
        const emojiMatch = name.match(/[\u{1F300}-\u{1F6FF}]/u);
        return emojiMatch ? emojiMatch[0] : '🔹';
    }
    
    function positionNodes(node, level = 0, angle = 0, parentX = 0, parentY = 0) {
        const distance = 100 + level * 50;
        const x = parentX + distance * Math.cos(angle);
        const y = parentY + distance * Math.sin(angle);
    
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
    
        const childNodes = Array.from(node.children).filter(child => child.classList.contains('node'));
        const childCount = childNodes.length;
        const angleStep = (Math.PI * 2) / childCount;
        let currentAngle = angle - Math.PI / 2;
    
        childNodes.forEach(child => {
            positionNodes(child, level + 1, currentAngle, x, y);
            currentAngle += angleStep;
        });
    }
})