class MatchNode {
    children: Map<number, MatchNode> = new Map<number, MatchNode>();

    constructor(public data: Uint8Array, public isLeave: boolean = false) {

    }

    getChild(input: Uint8Array, offset: number) : MatchNode | null {
        if ( input.length <= offset ) {
            return (this.isLeave) ? this : null;
        }
        let next = this.children.get(input[offset]);
        if ( next ) {
            let n = this.commonPrefix(input, offset, next.data);
            if ( n === next.data.length ) {
                return next.getChild(input, offset+n);
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    addChild(input: Uint8Array, offset: number) : void {
        if ( input.length === offset ) {
            this.isLeave = true;
        } else {
            let next = this.children.get(input[offset]);
            if ( next ) {
                let n = this.commonPrefix(input, offset, next.data);
                if ( n !== next.data.length ) {
                    // need to split next
                    next.split(n);
                }
                next.addChild(input, offset+n);
            } else {
                next = new MatchNode(input.slice(offset), true);
                this.children.set(input[offset], next);
            }
        }
    }

    commonPrefix(input: Uint8Array, offset: number, base: Uint8Array) : number {
        let max = Math.min(input.length-offset, base.length);
        for(let i=0; i<max; i++) {
            if ( input[i+offset] != base[i] ) return i
        }
        return max;
    }

    split(at: number) {
        let nextData = this.data.slice(at);
        let nextChild = new MatchNode(nextData, this.isLeave);
        nextChild.children = this.children;
        this.children = new Map<number, MatchNode>();
        this.children.set(nextData[0], nextChild);
        this.data = this.data.slice(0, at);
        this.isLeave = false;
    }
}

class MultiMatch extends MatchNode {

    constructor(items: string[]) {
        super(new Uint8Array(), false);
        items.forEach( x => this.addString(x) );
    }

    addString(str: string) : void {
        let enc = new TextEncoder();
        let array = enc.encode(str);
        this.addChild(array, 0);
    }

    matches(input: string) : boolean {
        let enc = new TextEncoder();
        let array = enc.encode(input);
        let n = this.getChild(array, 0);
        return (n != null);
    }
}

export default MultiMatch;