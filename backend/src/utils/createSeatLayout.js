const generateSeatLayout = (rows, columns) => {
    const layout = [];

    const getRowName = (index) => {
        if (index < 26) {
            return String.fromCharCode(65 + index);
        }

        let rowName = '';
        let num = index;
        while (num >= 0) {
            rowName = String.fromCharCode(65 + (num % 26)) + rowName;
            num = Math.floor(num / 26) - 1;
        }
        return rowName;
    };

    for (let i = 0; i < rows; i++) {
        const rowName = getRowName(i);
        const seats = [];

        for (let j = 1; j <= columns; j++) {
            seats.push(`${rowName}${j}`);
        }

        layout.push({
            row: rowName,
            seats: seats
        });
    }

    return layout;
};

module.exports = {
    generateSeatLayout
};