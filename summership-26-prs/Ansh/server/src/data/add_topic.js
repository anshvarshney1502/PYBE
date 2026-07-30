const fs = require('fs');
const path = require('path');

const contentPath = path.join(__dirname, 'content.json');

const duolingoTopic = [
  {
    topicId: "airport-security",
    topicName: "Sorting & Searching Basics",
    levels: [
      {
        levelId: 1,
        title: "Level 1: Passenger Missing",
        caseStudies: [
          {
            id: "airport-security-l1",
            scenario: "Passenger ID 928461 needs to board.\nThe passenger list is unsorted.",
            reflectiveQuestion: "How would you find the passenger?",
            stage1: {
              attempt1: [
                { text: "Check one by one", status: "correct", routesTo: "reveal" },
                { text: "Jump to the middle", status: "incorrect", routesTo: "reflection_1" },
                { text: "Pick randomly", status: "incorrect", routesTo: "reflection_2" }
              ],
              reflections: {
                reflection_1: {
                  prompt: "Why doesn't the middle help?",
                  attempt2: [
                    { text: "Because the list is unsorted, middle gives no info.", status: "correct" },
                    { text: "Middle always works.", status: "incorrect" }
                  ]
                },
                reflection_2: {
                  prompt: "What happens if you pick randomly?",
                  attempt2: [
                    { text: "You might check the same wrong item again.", status: "correct" },
                    { text: "Random is fastest.", status: "incorrect" }
                  ]
                }
              }
            },
            stage2: {
              conceptReveal: "💡 **Unsorted data → Linear Search**\n\nWhen data has no order, you must inspect item by item from start to end.",
              visualization: "1023\n6421\n928461  ✓ (Found!)\n7742\n5521"
            },
            stage3: {
              codeTemplate: "passenger_ids = [1023, 6421, 928461, 7742]\n\nfor id in _____:\n    if id == 928461:\n        print(\"Found!\")",
              tokens: [
                { value: "passenger_ids", correct: true },
                { value: "range(10)", correct: false, hint: "Pass the list passenger_ids to iterate." }
              ],
              reflection: "Why is checking one by one necessary on unsorted data?",
              learningOutcome: "Unordered data forces sequential Linear Search."
            }
          }
        ]
      },
      {
        levelId: 2,
        title: "Level 2: Organize & Sort",
        caseStudies: [
          {
            id: "airport-security-l2",
            scenario: "Tomorrow, 30,000 passengers arrive.\nShould the airport keep checking one by one every day?",
            reflectiveQuestion: "What is the best way to handle daily searches?",
            stage1: {
              attempt1: [
                { text: "Organize IDs first", status: "correct", routesTo: "reveal" },
                { text: "Keep checking one by one", status: "incorrect", routesTo: "reflection_1" }
              ],
              reflections: {
                reflection_1: {
                  prompt: "Scanning 30,000 items one by one every time is exhausting. How can we prepare the list?",
                  attempt2: [
                    { text: "Organize and sort the list once up front.", status: "correct" },
                    { text: "Never organize it.", status: "incorrect" }
                  ]
                }
              }
            },
            stage2: {
              conceptReveal: "💡 **Organizing data = Sorting**\n\nSorting costs time once up front, but makes future searching fast forever.",
              visualization: "Random\n  ↓\nSorted (Ascending order)"
            },
            stage3: {
              codeTemplate: "passenger_ids = [928461, 1023, 6421]\n\nsorted_list = sorted(_____)\nprint(sorted_list)",
              tokens: [
                { value: "passenger_ids", correct: true },
                { value: "\"sorted\"", correct: false, hint: "Pass the list passenger_ids into sorted()." }
              ],
              reflection: "Why is sorting an upfront investment?",
              learningOutcome: "Sorting organizes data to make searching faster."
            }
          }
        ]
      },
      {
        levelId: 3,
        title: "Level 3: Binary Search",
        caseStudies: [
          {
            id: "airport-security-l3",
            scenario: "Now the passenger list is sorted.\nA passenger arrives with ID 928461.",
            reflectiveQuestion: "Where should you begin searching?",
            stage1: {
              attempt1: [
                { text: "Middle", status: "correct", routesTo: "reveal" },
                { text: "First", status: "incorrect", routesTo: "reflection_1" },
                { text: "Last", status: "incorrect", routesTo: "reflection_2" }
              ],
              reflections: {
                reflection_1: {
                  prompt: "Starting at First ignores the sorted order! What position splits the list in half?",
                  attempt2: [
                    { text: "The Middle element.", status: "correct" },
                    { text: "The First element.", status: "incorrect" }
                  ]
                },
                reflection_2: {
                  prompt: "Starting at Last is still linear search in reverse. What cuts the list in half?",
                  attempt2: [
                    { text: "The Middle element.", status: "correct" },
                    { text: "The Last element.", status: "incorrect" }
                  ]
                }
              }
            },
            stage2: {
              conceptReveal: "💡 **Binary Search**\n\nEvery check cuts the remaining items in half!",
              visualization: "25000\n  ↓\n12500\n  ↓\n 6250\n  ↓\n  ...\n  ↓\n    1 (Found!)"
            },
            stage3: {
              codeTemplate: "low = 0\nhigh = len(passenger_ids) - 1\n\nmid = (low + high) // _____\nprint(\"Middle index:\", mid)",
              tokens: [
                { value: "2", correct: true },
                { value: "10", correct: false, hint: "Divide by 2 to find the exact middle." }
              ],
              reflection: "Why does Binary Search require sorted data?",
              learningOutcome: "Binary Search cuts search space in half each step on sorted data."
            }
          }
        ]
      },
      {
        levelId: 4,
        title: "Level 4: System Strategy",
        caseStudies: [
          {
            id: "airport-security-l4",
            scenario: "Airport software has two situations.\n\nSituation A: Passenger list changes every minute.\nSituation B: Passenger list stays the same all day.",
            reflectiveQuestion: "Which strategy fits Situation A (changes every minute)?",
            stage1: {
              attempt1: [
                { text: "Linear Search", status: "correct", routesTo: "reveal" },
                { text: "Binary Search", status: "incorrect", routesTo: "reflection_1" }
              ],
              reflections: {
                reflection_1: {
                  prompt: "If data changes every minute, re-sorting over and over wastes time! What needs zero setup cost?",
                  attempt2: [
                    { text: "Linear Search.", status: "correct" },
                    { text: "Binary Search.", status: "incorrect" }
                  ]
                }
              }
            },
            stage2: {
              conceptReveal: "💡 **Algorithmic Trade-off**\n\n• High Updates → **Linear Search** (No sorting cost)\n• Static Data → **Sort once + Binary Search** (Fast lookups)",
              visualization: "Updates every minute ➔ Linear Search\nStays same all day   ➔ Sort once + Binary Search"
            },
            stage3: {
              codeTemplate: "def choose_strategy(updates_often):\n    if updates_often:\n        return \"linear_search\"\n    else:\n        return _____\n\nprint(choose_strategy(False))",
              tokens: [
                { value: "\"sort_and_binary_search\"", correct: true },
                { value: "\"linear_search\"", correct: false, hint: "Static data uses sort_and_binary_search." }
              ],
              reflection: "Which strategy saves more time for static data?",
              learningOutcome: "Learner chooses algorithms based on update frequency."
            }
          }
        ]
      }
    ]
  }
];

fs.writeFileSync(contentPath, JSON.stringify(duolingoTopic, null, 2), 'utf-8');
console.log('Successfully updated add_topic.js with Duolingo-style levels!');
