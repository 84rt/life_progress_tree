document.addEventListener("DOMContentLoaded", () => {
    const canvasContainer = document.getElementById("canvas-container");
    const canvas = document.getElementById("canvas");
    const resetButton = document.getElementById("reset-button");
    const mainNode = document.getElementById("main-skill");
    const nodes = document.getElementsByClassName("node");

    let isDragging = false;
    let startX, startY;
    let offsetX = 0, offsetY = 0;
    let scale = 1;

    // Initial positioning
    positionNodes();

    // Reposition nodes on window resize
    window.addEventListener("resize", positionNodes);

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

    function positionNodes() {
        centerMainNode(mainNode);
        positionOtherNodes(mainNode, nodes);
    }

    function centerMainNode(node) {
        const canvasRect = canvasContainer.getBoundingClientRect();
        const nodeRect = node.getBoundingClientRect();

        node.style.left = `${canvasRect.width / 2 - nodeRect.width / 2}px`;
        node.style.top = `${canvasRect.height / 2 - nodeRect.height / 2}px`;
    }

    function positionOtherNodes(mainNode, nodes) {
        const mainRect = mainNode.getBoundingClientRect();
        const distance = 150; // Adjust distance as needed

        let angleStep = 360 / (nodes.length - 1);
        let currentAngle = 0;

        // Remove existing lines
        document.querySelectorAll('.line').forEach(line => line.remove());

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node === mainNode) continue;

            const x = mainRect.left + mainRect.width / 2 + distance * Math.cos(currentAngle * Math.PI / 180);
            const y = mainRect.top + mainRect.height / 2 + distance * Math.sin(currentAngle * Math.PI / 180);

            node.style.left = `${x - node.offsetWidth / 2}px`;
            node.style.top = `${y - node.offsetHeight / 2}px`;

            drawLine(mainNode, node);

            currentAngle += angleStep;
        }
    }

    function drawLine(parent, child) {
        const parentRect = parent.getBoundingClientRect();
        const childRect = child.getBoundingClientRect();

        const x1 = parentRect.left + parentRect.width / 2;
        const y1 = parentRect.top + parentRect.height / 2;
        const x2 = childRect.left + childRect.width / 2;
        const y2 = childRect.top + childRect.height / 2;

        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

        const line = document.createElement('div');
        line.className = 'line';
        line.style.width = `${length}px`;
        line.style.transform = `rotate(${angle}deg)`;
        line.style.left = `${x1}px`;
        line.style.top = `${y1}px`;

        canvas.appendChild(line);
    }
});