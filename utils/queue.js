export default class Queue {
    constructor() {
        this.arr = []
    }

    empty() {
        return this.arr.length === 0
    }

    pop() {
        this.arr.shift()
    }

    push(ele) {
        this.arr.push(ele)
    }

    front() {
        if (this.empty()) return undefined
        return this.arr[0]
    }

    size(){
        return this.arr.length
    }

}