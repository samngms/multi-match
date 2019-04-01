import MultiMatch from '../lib/MultiMatch';
import 'mocha';
import {expect} from 'chai';
import crypto from 'crypto';

describe('Performance test', () => {
    it('10k x100 test', () => {
        perfTest(10*1000, 100);
    })

    it('50k x100 test', () => {
        perfTest(50*1000, 100);
    })

    it('100k x100 test', () => {
        perfTest(100*1000, 100);
    })

    it('100k x5k test', () => {
        perfTest(100*1000, 5000);
    })

    it('100k x50k test', () => {
        perfTest(100*1000, 50*1000);
    })

    it('500k x50k test', () => {
        perfTest(500*1000, 50*1000);
    })

    it('500k x1M test', () => {
        perfTest(500*1000, 1000*1000);
    })

    it('1M x1M test', () => {
        perfTest(1000*1000, 1000*1000);
    })
});

function perfTest(totalCount: number, sampleCount: number) {
    let data: string[] = [];
    let set = new Set<String>();
    let pattern = '';
    for(let i=0; i<totalCount; i++) {
        let s = crypto.randomBytes(32).toString('hex');
        data.push(s);
        // force the system to clone 's'
        set.add((' ' + s).slice(1));
        if ( totalCount <= 100*1000 ) {
            if ( !pattern ) pattern = s;
            else pattern = pattern + '|' + s;
        }
    }

    let start = 0;

    let mm = new MultiMatch(data);
    start = new Date().getTime();
    for(let i=0; i<sampleCount; i++) {
        let b = mm.matches(data[Math.floor(Math.random() * data.length)]);
        expect(b).to.be.true;
    }
    let total0 = new Date().getTime() - start;

    let rx = new RegExp('^' + pattern + '$');
    start = new Date().getTime();
    if ( totalCount <= 100*1000 ) {
        // regex throws exception if more than 100k
        for(let i=0; i<sampleCount; i++) {
            let b = rx.test(data[Math.floor(Math.random() * data.length)]);
            expect(b).to.be.true;
        }
    }
    let total1 = new Date().getTime() - start;

    start = new Date().getTime();
    for(let i=0; i<sampleCount; i++) {
        let idx = Math.floor(Math.random() * data.length);
        //let b = data.includes(data[idx]);
        let b = set.has(data[idx]);
        expect(b).to.be.true;
    }
    let total2 = new Date().getTime() - start;

    console.log(`MultiMatch: ${total0}ms, Regex: ${total1}ms, Set.has: ${total2}ms`);
}