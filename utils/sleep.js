export default function sleep(sec){
    // This function should resolve the promise after 'min' minutes
    return new Promise((resolve, _) => {
        setTimeout(resolve, sec * 1000)
    })
}