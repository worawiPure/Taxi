module.exports = {
    getMonthName: function(month) {
        if(month == '01') return 'ม.ค.';
        else if(month == '02') return 'ก.พ.';
        else if(month == '03') return 'มี.ค.';
        else if(month == '04') return 'เม.ย.';
        else if(month == '05') return 'พ.ค.';
        else if(month == '06') return 'มิ.ย.';
        else if(month == '07') return 'ก.ค.';
        else if(month == '08') return 'ส.ค.';
        else if(month == '09') return 'ก.ย.';
        else if(month == '10') return 'ต.ค.';
        else if(month == '11') return 'พ.ย.';
        else if(month == '12') return 'ธ.ค.';
        else if(month == '') return '';
    }
};