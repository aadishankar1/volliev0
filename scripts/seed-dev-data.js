"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDevData = seedDevData;
exports.cleanupDevData = cleanupDevData;
var fetch = require('node-fetch');
var API_BASE_PATH = process.env.NEXT_PUBLIC_API_BASE_PATH;
async function request(endpoint, method = "GET", data = null) {
    try {
        var headers = {
            "Content-Type": "application/json",
        };
        var options = {
            method: method,
            headers: headers,
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        var res = await fetch(API_BASE_PATH + endpoint, options);
        if (!res.ok) {
            var errorData = await res.json();
            throw new Error(errorData.err?.msg || 'Request failed');
        }
        return res.json();
    }
    catch (error) {
        throw error;
    }
}
var endpoints = {
    login: "/user/login",
    user: "/user/",
    initiative: "/initiative",
    assignInitiative: "/assign-initiative",
};
var sampleInitiatives = [
    {
        title: "Campus Clean-up Drive",
        description: "Help keep our campus beautiful by participating in our monthly clean-up drive.",
        timeCommitment: "3 hours",
        address: "UC Berkeley Campus",
        volunteersNeeded: 10,
        isOnCampus: true,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
        interests: ["Environmental Conservation", "Community Development"],
        status: 0, // Open
    },
    {
        title: "Math Tutoring Program",
        description: "Provide math tutoring to local high school students.",
        timeCommitment: "2 hours per week",
        address: "Berkeley Public Library",
        volunteersNeeded: 5,
        isOnCampus: false,
        startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        interests: ["Academic Tutoring", "Education & Youth"],
        status: 0,
    },
    {
        title: "Food Bank Distribution",
        description: "Help distribute food to families in need.",
        timeCommitment: "4 hours",
        address: "Berkeley Food Bank",
        volunteersNeeded: 15,
        isOnCampus: false,
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
        interests: ["Food Security", "Community Development"],
        status: 0,
    }
];
var sampleAchievements = [
    {
        name: "First Steps",
        description: "Complete your first volunteer initiative",
        xp: 100,
        level: "common"
    },
    {
        name: "Helping Hand",
        description: "Volunteer for 10 hours",
        xp: 250,
        level: "common"
    },
    {
        name: "Community Pillar",
        description: "Help 5 different organizations",
        xp: 500,
        level: "rare"
    }
];
async function seedDevData() {
    try {
        // Create a test organization
        var orgData = {
            email: "testorg@berkeley.edu",
            pass: "testpass123",
            name: "Test Organization",
            userType: 1,
            bio: "A test organization for development",
            address: "UC Berkeley",
            lat: 37.8719,
            lng: -122.2585,
            intrests: ["Education & Youth", "Community Development"]
        };
        console.log("Creating test organization...");
        var org = await request(endpoints.user, "POST", orgData);
        // Create initiatives
        console.log("Creating sample initiatives...");
        for (var _i = 0, sampleInitiatives_1 = sampleInitiatives; _i < sampleInitiatives_1.length; _i++) {
            var initiative = sampleInitiatives_1[_i];
            await request(endpoints.initiative, "POST", __assign(__assign({}, initiative), { organizationId: org.res._id }));
        }
        // Create achievements
        console.log("Creating sample achievements...");
        for (var _a = 0, sampleAchievements_1 = sampleAchievements; _a < sampleAchievements_1.length; _a++) {
            var achievement = sampleAchievements_1[_a];
            await request("/achievements", "POST", achievement);
        }
        console.log("Development data seeded successfully!");
        return true;
    }
    catch (error) {
        console.error("Error seeding development data:", error);
        return false;
    }
}
function cleanupDevData() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                // Add cleanup logic here
                console.log("Cleaning up development data...");
                return [2 /*return*/, true];
            }
            catch (error) {
                console.error("Error cleaning up development data:", error);
                return [2 /*return*/, false];
            }
            return [2 /*return*/];
        });
    });
}
