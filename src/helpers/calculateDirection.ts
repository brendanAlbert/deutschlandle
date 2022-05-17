


const calculateDirection = (glat: number, glon: number, alat: number, alon: number, d: number) => {

    // smaller long means further west
    // larger long means more east

    // smaller lat = futher south

    if (d == 0) {
        const correct = 19;
        // return getDirectionIcon(correct);
        return correct;
    }

    if (glon < alon) {
        // answer is to the right

        // if difference between lat1 - lat2 is small, then use right arrow without up down component

        if (Math.abs(glat - alat) < 0.4) {
            const right_arrow = 7;
            return right_arrow;
        }


        if (glat > alat) {

             // if lon1 - lon2 diff is small, use pure down arrow
            if (Math.abs(glon - alon) < 0.4) {
                const down_arrow = 3;
                return down_arrow;
            }

            // answer is below
            const down_right = 5;
            // return getDirectionIcon(down_right);
            return down_right;
        }
        
        if (glat < alat) {

              // if lon1 - lon2 diff is small, use pure up arrow
            if (Math.abs(glon - alon) < 0.4) {
                const up_arrow = 11;
                return up_arrow;
            }

            // answer is above
            const up_right = 9;
            return up_right;
        }
    }

    if (glon > alon) {
        // answer is to the left

        // if difference between lat1 - lat2 is small, then use left arrow without up down component
        if (Math.abs(glat - alat) < 0.4) {
            const left_arrow = 15;
            return left_arrow;
        }

        if (glat > alat) {

             // if lon1 - lon2 diff is small, use pure down arrow
            if (Math.abs(glon - alon) < 0.4) {
                const down_arrow = 3;
                return down_arrow;
            }

            // answer is below
             const down_left = 17;
            // return getDirectionIcon(down_left);
            return down_left;
        }

        if (glat < alat) {

              // if lon1 - lon2 diff is small, use pure up arrow
            if (Math.abs(glon - alon) < 0.4) {
                const up_arrow = 11;
                return up_arrow;
            }

            // answer is above
             const up_left = 13;
            // return getDirectionIcon(up_left);
            return up_left;
        }

    }
}

export { calculateDirection };

