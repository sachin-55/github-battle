import React from 'react';

const useHover = () => {
    const [hovering, setHovering] = React.useState(false);

    const onMouseOver = () => setHovering(true);
    const onMouseOut = () => setHovering(false);

    return [hovering, { onMouseOut, onMouseOver }]
}

export default useHover;
