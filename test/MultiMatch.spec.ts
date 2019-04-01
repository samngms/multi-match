import MultiMatch from '../lib/MultiMatch';
import 'mocha';
import {expect} from 'chai';
import crypto from 'crypto';

describe('Basic test', () => {
    it('Test set1', () => {
        let input = ['abcdef', 'xyz', 'abcmno', 'abq'];
        let mm = new MultiMatch(input);

        expect(mm.matches(input[0])).to.be.true
        expect(mm.matches(input[1])).to.be.true
        expect(mm.matches(input[2])).to.be.true
        expect(mm.matches(input[3])).to.be.true        
    })

    it('Test set2', () => {
        let input = ['abc', 'ab', 'abcd', 'abce'];
        let mm = new MultiMatch(input);

        expect(mm.matches(input[0])).to.be.true
        expect(mm.matches(input[1])).to.be.true
    })
});

describe('Random test', () => {
    it('Test set1', () => {
        let input: string[] = [];
        for(let i=0; i<10000; i++) {
            input.push(crypto.randomBytes(2).toString('hex'));
        }
        let mm = new MultiMatch(input);

        for(let i=0; i<10000; i++) {
            expect(mm.matches(input[i])).to.be.true;
        }

        for(let i=0; i<100; i++) {
            while(true) {
                let s = crypto.randomBytes(2).toString('hex');
                if ( input.includes(s) ) continue;
                expect(mm.matches(s)).to.be.false;
                break;
            }
        }

        for(let i=0; i<100; i++) {
            let s = crypto.randomBytes(1).toString('hex');
            expect(mm.matches(s)).to.be.false;
        }

        for(let i=0; i<100; i++) {
            let s = crypto.randomBytes(3).toString('hex');
            expect(mm.matches(s)).to.be.false;
        }
    })


    it('Test set2', () => {
        let input: string[] = [];
        for(let i=0; i<100000; i++) {
            let n = crypto.randomBytes(1).readUInt8(0) & 0x07;
            input.push(crypto.randomBytes(n).toString('hex'));
        }
        let mm = new MultiMatch(input);

        for(let i=0; i<input.length; i++) {
            let b = mm.matches(input[i]);
            if ( !b ) {
                console.log('wrong');
            }
            expect(mm.matches(input[i])).to.be.true;
        }
    })
})

function getRandom(max: number) {
    // we expect the number to be with 4 bytes
    return crypto.randomBytes(4).readUInt32BE(0) % max;
}