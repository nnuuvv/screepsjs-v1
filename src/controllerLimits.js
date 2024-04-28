const controllerLimits = {
    extension (level) {
        switch (level) {
            case 2: return 5;
            case 3: return 10;
            case 4: return 20;
            case 5: return 30;
            case 6: return 40;
            case 7: return 50;
            case 8: return 60;
            default: return 0;
        }
    },
    tower (level) {
        switch (level) {
            case 3: return 1;
            case 4: return 1;
            case 5: return 2;
            case 6: return 2;
            case 7: return 3;
            case 8: return 6;
        }
    }
    
    
}

module.exports = controllerLimits;