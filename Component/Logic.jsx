const Indications = ['knife' , 'gun'];

export default function logic(predict){
    let detected = false;

    predict.forEach(element => {
        if(Indications.includes(element.class) && element.score>0.7){
            detected = true;
        }
    });

    return detected;

}