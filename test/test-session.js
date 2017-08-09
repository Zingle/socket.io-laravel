const expect = require("expect.js");
const sinon = require("sinon");
const session = require("../lib/session");

const key = "12345678911234567892123456789312";
const iv = "1234567891123456";
const cookieName = "session_id";
const defaultCookie = "laravel_session";
const plain = "foo";
const cipher = "ff1b56874bd6c3c02f340fd45e9182ee";

// generated using (note PHP serialized '42' which matches id below):
// new Buffer(JSON.stringify({
//     iv: new Buffer(iv).toString("base64"),
//     value: encrypt(key, iv, 's:2:"42";').toString("base64")
// })).toString("base64");
const cookie = "eyJpdiI6Ik1USXpORFUyTnpnNU1URXlNelExTmc9PSIsInZhbHVlIjoiRWdZeGFKTDVpRTM3NkJickNJbXlhdz09In0=";
const id = "42";

function makeSocket() {
    return {request: {cookies: {[cookieName]: cookie}}};
}

describe("session(key, [cookieName], fetch, [errorHandler]) => function", () => {
    var fetch, onerr, error,
        middleware;

    beforeEach(() => {
        // PHP double serialized object representing {id:"42"}
        var id42 = 's:37:"O:8:"stdClass":1:{s:2:"id";s:2:"42";}";';

        fetch = id => Promise.resolve(id42);
        onerr = err => error = err;
        error = null;
        middleware = session(key, cookieName, fetch, onerr);
    })

    it("should return socket middleware", () => {
        expect(middleware).to.be.a("function");
        expect(middleware.length).to.be(2);
    });

    it("should set sessionId on socket.request", done => {
        const socket = makeSocket();

        middleware(socket, () => {
            expect(socket.request.sessionId).to.be(id);
            done();
        });
    });

    it("should set session data on socket.request", done => {
        const socket = makeSocket();

        middleware(socket, err => {
            if (err) done(err);
            expect(socket.request.session).to.be.an("object");
            expect(socket.request.session.id).to.be(id);
            done();
        });
    });

    it("should use 'laravel_session' as default cookie name", done => {
        const socket = makeSocket();
        const middleware = session(key, fetch, onerr);
        const request = socket.request;

        request.cookies[defaultCookie] = request.cookies[cookieName];
        delete request.cookies[cookieName];

        middleware(socket, err => {
            if (err) done(err);
            expect(socket.request.sessionId).to.be(id);
            done();
        });
    });
});

// generate an object that looks like a Socket.IO socket object
function makeSocket() {
    return {request: {cookies: {[cookieName]: cookie}}};
}
