/** LeetCode 75 study plan — 75 problems across 22 groups */
export type Lc75Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Lc75ProblemMeta = {
  slug: string;
  title: string;
  lc: number;
  difficulty: Lc75Difficulty;
  /** 1–5 importance for interviews (5 = must-do) */
  stars: number;
};

export type Lc75Pattern = {
  slug: string;
  title: string;
  order: number;
  icon: string;
  concepts: string;
  signal: string;
  overview: string;
  whenToUse: string[];
  template: string;
  tip: string;
  interviewWhy: string;
  problems: Lc75ProblemMeta[];
};

export const lc75Patterns: Lc75Pattern[] = [
  {
    "slug": "array-string",
    "title": "Array / String",
    "order": 1,
    "icon": "BetweenHorizonalStart",
    "concepts": "Strings and in-place array transforms.",
    "signal": "Strings and in-place array transforms.",
    "overview": "This LeetCode 75 section focuses on Array / String. Master the pattern, then finish every problem below — especially those marked 5 stars (must-do).",
    "whenToUse": [
      "You see a problem that fits: Strings and in-place array transforms.",
      "You want a structured LeetCode 75 study path",
      "Interview prep with high-frequency patterns"
    ],
    "template": "// Array / String — LeetCode 75\n// Restate → pick pattern → dry-run → code → edge cases",
    "tip": "Prioritize 5-star problems when time is short.",
    "interviewWhy": "Array / String appears constantly in screening rounds.",
    "problems": [
      {
        "slug": "merge-strings-alternately",
        "title": "Merge Strings Alternately",
        "lc": 1768,
        "difficulty": "Easy",
        "stars": 3
      },
      {
        "slug": "greatest-common-divisor-of-strings",
        "title": "Greatest Common Divisor of Strings",
        "lc": 1071,
        "difficulty": "Easy",
        "stars": 3
      },
      {
        "slug": "kids-with-the-greatest-number-of-candies",
        "title": "Kids With the Greatest Number of Candies",
        "lc": 1431,
        "difficulty": "Easy",
        "stars": 3
      },
      {
        "slug": "can-place-flowers",
        "title": "Can Place Flowers",
        "lc": 605,
        "difficulty": "Easy",
        "stars": 3
      },
      {
        "slug": "reverse-vowels-of-a-string",
        "title": "Reverse Vowels of a String",
        "lc": 345,
        "difficulty": "Easy",
        "stars": 3
      },
      {
        "slug": "reverse-words-in-a-string",
        "title": "Reverse Words in a String",
        "lc": 151,
        "difficulty": "Medium",
        "stars": 4
      },
      {
        "slug": "product-of-array-except-self",
        "title": "Product of Array Except Self",
        "lc": 238,
        "difficulty": "Medium",
        "stars": 5
      },
      {
        "slug": "increasing-triplet-subsequence",
        "title": "Increasing Triplet Subsequence",
        "lc": 334,
        "difficulty": "Medium",
        "stars": 4
      },
      {
        "slug": "string-compression",
        "title": "String Compression",
        "lc": 443,
        "difficulty": "Medium",
        "stars": 4
      }
    ]
  },
  {
    "slug": "two-pointers",
    "title": "Two Pointers",
    "order": 2,
    "icon": "ArrowLeftRight",
    "concepts": "Left-right scans on arrays and strings.",
    "signal": "Left-right scans on arrays and strings.",
    "overview": "This LeetCode 75 section focuses on Two Pointers. Master the pattern, then finish every problem below — especially those marked 5 stars (must-do).",
    "whenToUse": [
      "You see a problem that fits: Left-right scans on arrays and strings.",
      "You want a structured LeetCode 75 study path",
      "Interview prep with high-frequency patterns"
    ],
    "template": "// Two Pointers — LeetCode 75\n// Restate → pick pattern → dry-run → code → edge cases",
    "tip": "Prioritize 5-star problems when time is short.",
    "interviewWhy": "Two Pointers appears constantly in screening rounds.",
    "problems": [
      {
        "slug": "move-zeroes",
        "title": "Move Zeroes",
        "lc": 283,
        "difficulty": "Easy",
        "stars": 5
      },
      {
        "slug": "is-subsequence",
        "title": "Is Subsequence",
        "lc": 392,
        "difficulty": "Easy",
        "stars": 3
      },
      {
        "slug": "container-with-most-water",
        "title": "Container With Most Water",
        "lc": 11,
        "difficulty": "Medium",
        "stars": 5
      },
      {
        "slug": "max-number-of-k-sum-pairs",
        "title": "Max Number of K-Sum Pairs",
        "lc": 1679,
        "difficulty": "Medium",
        "stars": 4
      }
    ]
  },
  {
    "slug": "sliding-window",
    "title": "Sliding Window",
    "order": 3,
    "icon": "PanelRight",
    "concepts": "Fixed and variable windows.",
    "signal": "Fixed and variable windows.",
    "overview": "This LeetCode 75 section focuses on Sliding Window. Master the pattern, then finish every problem below — especially those marked 5 stars (must-do).",
    "whenToUse": [
      "You see a problem that fits: Fixed and variable windows.",
      "You want a structured LeetCode 75 study path",
      "Interview prep with high-frequency patterns"
    ],
    "template": "// Sliding Window — LeetCode 75\n// Restate → pick pattern → dry-run → code → edge cases",
    "tip": "Prioritize 5-star problems when time is short.",
    "interviewWhy": "Sliding Window appears constantly in screening rounds.",
    "problems": [
      {
        "slug": "maximum-average-subarray-i",
        "title": "Maximum Average Subarray I",
        "lc": 643,
        "difficulty": "Easy",
        "stars": 3
      },
      {
        "slug": "maximum-number-of-vowels-in-a-substring-of-given-length",
        "title": "Maximum Number of Vowels in a Substring of Given Length",
        "lc": 1456,
        "difficulty": "Medium",
        "stars": 4
      },
      {
        "slug": "max-consecutive-ones-iii",
        "title": "Max Consecutive Ones III",
        "lc": 1004,
        "difficulty": "Medium",
        "stars": 4
      },
      {
        "slug": "longest-subarray-of-1-s-after-deleting-one-element",
        "title": "Longest Subarray of 1's After Deleting One Element",
        "lc": 1493,
        "difficulty": "Medium",
        "stars": 5
      }
    ]
  },
  {
    "slug": "prefix-sum",
    "title": "Prefix Sum",
    "order": 4,
    "icon": "BetweenHorizonalStart",
    "concepts": "Running sums and pivot.",
    "signal": "Running sums and pivot.",
    "overview": "This LeetCode 75 section focuses on Prefix Sum. Master the pattern, then finish every problem below — especially those marked 5 stars (must-do).",
    "whenToUse": [
      "You see a problem that fits: Running sums and pivot.",
      "You want a structured LeetCode 75 study path",
      "Interview prep with high-frequency patterns"
    ],
    "template": "// Prefix Sum — LeetCode 75\n// Restate → pick pattern → dry-run → code → edge cases",
    "tip": "Prioritize 5-star problems when time is short.",
    "interviewWhy": "Prefix Sum appears constantly in screening rounds.",
    "problems": [
      {
        "slug": "find-the-highest-altitude",
        "title": "Find the Highest Altitude",
        "lc": 1732,
        "difficulty": "Easy",
        "stars": 3
      },
      {
        "slug": "find-pivot-index",
        "title": "Find Pivot Index",
        "lc": 724,
        "difficulty": "Easy",
        "stars": 5
      }
    ]
  },
  {
    "slug": "hash-map-set",
    "title": "Hash Map / Set",
    "order": 5,
    "icon": "Hash",
    "concepts": "Frequency and membership.",
    "signal": "Frequency and membership.",
    "overview": "This LeetCode 75 section focuses on Hash Map / Set. Master the pattern, then finish every problem below — especially those marked 5 stars (must-do).",
    "whenToUse": [
      "You see a problem that fits: Frequency and membership.",
      "You want a structured LeetCode 75 study path",
      "Interview prep with high-frequency patterns"
    ],
    "template": "// Hash Map / Set — LeetCode 75\n// Restate → pick pattern → dry-run → code → edge cases",
    "tip": "Prioritize 5-star problems when time is short.",
    "interviewWhy": "Hash Map / Set appears constantly in screening rounds.",
    "problems": [
      {
        "slug": "find-the-difference-of-two-arrays",
        "title": "Find the Difference of Two Arrays",
        "lc": 2215,
        "difficulty": "Easy",
        "stars": 3
      },
      {
        "slug": "unique-number-of-occurrences",
        "title": "Unique Number of Occurrences",
        "lc": 1207,
        "difficulty": "Easy",
        "stars": 3
      },
      {
        "slug": "determine-if-two-strings-are-close",
        "title": "Determine if Two Strings Are Close",
        "lc": 1657,
        "difficulty": "Medium",
        "stars": 5
      },
      {
        "slug": "equal-row-and-column-pairs",
        "title": "Equal Row and Column Pairs",
        "lc": 2352,
        "difficulty": "Medium",
        "stars": 4
      }
    ]
  },
  {
    "slug": "stack",
    "title": "Stack",
    "order": 6,
    "icon": "Layers",
    "concepts": "LIFO parsing and collisions.",
    "signal": "LIFO parsing and collisions.",
    "overview": "This LeetCode 75 section focuses on Stack. Master the pattern, then finish every problem below — especially those marked 5 stars (must-do).",
    "whenToUse": [
      "You see a problem that fits: LIFO parsing and collisions.",
      "You want a structured LeetCode 75 study path",
      "Interview prep with high-frequency patterns"
    ],
    "template": "// Stack — LeetCode 75\n// Restate → pick pattern → dry-run → code → edge cases",
    "tip": "Prioritize 5-star problems when time is short.",
    "interviewWhy": "Stack appears constantly in screening rounds.",
    "problems": [
      {
        "slug": "removing-stars-from-a-string",
        "title": "Removing Stars From a String",
        "lc": 2390,
        "difficulty": "Medium",
        "stars": 4
      },
      {
        "slug": "asteroid-collision",
        "title": "Asteroid Collision",
        "lc": 735,
        "difficulty": "Medium",
        "stars": 5
      },
      {
        "slug": "decode-string",
        "title": "Decode String",
        "lc": 394,
        "difficulty": "Medium",
        "stars": 5
      }
    ]
  },
  {
    "slug": "queue",
    "title": "Queue",
    "order": 7,
    "icon": "PanelRight",
    "concepts": "FIFO and multi-queue simulation.",
    "signal": "FIFO and multi-queue simulation.",
    "overview": "This LeetCode 75 section focuses on Queue. Master the pattern, then finish every problem below — especially those marked 5 stars (must-do).",
    "whenToUse": [
      "You see a problem that fits: FIFO and multi-queue simulation.",
      "You want a structured LeetCode 75 study path",
      "Interview prep with high-frequency patterns"
    ],
    "template": "// Queue — LeetCode 75\n// Restate → pick pattern → dry-run → code → edge cases",
    "tip": "Prioritize 5-star problems when time is short.",
    "interviewWhy": "Queue appears constantly in screening rounds.",
    "problems": [
      {
        "slug": "number-of-recent-calls",
        "title": "Number of Recent Calls",
        "lc": 933,
        "difficulty": "Easy",
        "stars": 3
      },
      {
        "slug": "dota2-senate",
        "title": "Dota2 Senate",
        "lc": 649,
        "difficulty": "Medium",
        "stars": 4
      }
    ]
  },
  {
    "slug": "linked-list",
    "title": "Linked List",
    "order": 8,
    "icon": "Link",
    "concepts": "Pointer rewiring.",
    "signal": "Pointer rewiring.",
    "overview": "This LeetCode 75 section focuses on Linked List. Master the pattern, then finish every problem below — especially those marked 5 stars (must-do).",
    "whenToUse": [
      "You see a problem that fits: Pointer rewiring.",
      "You want a structured LeetCode 75 study path",
      "Interview prep with high-frequency patterns"
    ],
    "template": "// Linked List — LeetCode 75\n// Restate → pick pattern → dry-run → code → edge cases",
    "tip": "Prioritize 5-star problems when time is short.",
    "interviewWhy": "Linked List appears constantly in screening rounds.",
    "problems": [
      {
        "slug": "delete-the-middle-node-of-a-linked-list",
        "title": "Delete the Middle Node of a Linked List",
        "lc": 2095,
        "difficulty": "Medium",
        "stars": 4
      },
      {
        "slug": "odd-even-linked-list",
        "title": "Odd Even Linked List",
        "lc": 328,
        "difficulty": "Medium",
        "stars": 4
      },
      {
        "slug": "reverse-linked-list",
        "title": "Reverse Linked List",
        "lc": 206,
        "difficulty": "Easy",
        "stars": 5
      },
      {
        "slug": "maximum-twin-sum-of-a-linked-list",
        "title": "Maximum Twin Sum of a Linked List",
        "lc": 2130,
        "difficulty": "Medium",
        "stars": 5
      }
    ]
  },
  {
    "slug": "binary-tree-dfs",
    "title": "Binary Tree DFS",
    "order": 9,
    "icon": "GitBranch",
    "concepts": "Recursive tree walks.",
    "signal": "Recursive tree walks.",
    "overview": "This LeetCode 75 section focuses on Binary Tree DFS. Master the pattern, then finish every problem below — especially those marked 5 stars (must-do).",
    "whenToUse": [
      "You see a problem that fits: Recursive tree walks.",
      "You want a structured LeetCode 75 study path",
      "Interview prep with high-frequency patterns"
    ],
    "template": "// Binary Tree DFS — LeetCode 75\n// Restate → pick pattern → dry-run → code → edge cases",
    "tip": "Prioritize 5-star problems when time is short.",
    "interviewWhy": "Binary Tree DFS appears constantly in screening rounds.",
    "problems": [
      {
        "slug": "maximum-depth-of-binary-tree",
        "title": "Maximum Depth of Binary Tree",
        "lc": 104,
        "difficulty": "Easy",
        "stars": 3
      },
      {
        "slug": "leaf-similar-trees",
        "title": "Leaf-Similar Trees",
        "lc": 872,
        "difficulty": "Easy",
        "stars": 3
      },
      {
        "slug": "count-good-nodes-in-binary-tree",
        "title": "Count Good Nodes in Binary Tree",
        "lc": 1448,
        "difficulty": "Medium",
        "stars": 4
      },
      {
        "slug": "path-sum-iii",
        "title": "Path Sum III",
        "lc": 437,
        "difficulty": "Medium",
        "stars": 5
      },
      {
        "slug": "longest-zigzag-path-in-a-binary-tree",
        "title": "Longest ZigZag Path in a Binary Tree",
        "lc": 1372,
        "difficulty": "Medium",
        "stars": 4
      },
      {
        "slug": "lowest-common-ancestor-of-a-binary-tree",
        "title": "Lowest Common Ancestor of a Binary Tree",
        "lc": 236,
        "difficulty": "Medium",
        "stars": 5
      }
    ]
  },
  {
    "slug": "binary-tree-bfs",
    "title": "Binary Tree BFS",
    "order": 10,
    "icon": "Share2",
    "concepts": "Level-order traversal.",
    "signal": "Level-order traversal.",
    "overview": "This LeetCode 75 section focuses on Binary Tree BFS. Master the pattern, then finish every problem below — especially those marked 5 stars (must-do).",
    "whenToUse": [
      "You see a problem that fits: Level-order traversal.",
      "You want a structured LeetCode 75 study path",
      "Interview prep with high-frequency patterns"
    ],
    "template": "// Binary Tree BFS — LeetCode 75\n// Restate → pick pattern → dry-run → code → edge cases",
    "tip": "Prioritize 5-star problems when time is short.",
    "interviewWhy": "Binary Tree BFS appears constantly in screening rounds.",
    "problems": [
      {
        "slug": "binary-tree-right-side-view",
        "title": "Binary Tree Right Side View",
        "lc": 199,
        "difficulty": "Medium",
        "stars": 4
      },
      {
        "slug": "maximum-level-sum-of-a-binary-tree",
        "title": "Maximum Level Sum of a Binary Tree",
        "lc": 1161,
        "difficulty": "Medium",
        "stars": 4
      }
    ]
  },
  {
    "slug": "bst",
    "title": "Binary Search Tree",
    "order": 11,
    "icon": "GitBranch",
    "concepts": "Ordered tree operations.",
    "signal": "Ordered tree operations.",
    "overview": "This LeetCode 75 section focuses on Binary Search Tree. Master the pattern, then finish every problem below — especially those marked 5 stars (must-do).",
    "whenToUse": [
      "You see a problem that fits: Ordered tree operations.",
      "You want a structured LeetCode 75 study path",
      "Interview prep with high-frequency patterns"
    ],
    "template": "// Binary Search Tree — LeetCode 75\n// Restate → pick pattern → dry-run → code → edge cases",
    "tip": "Prioritize 5-star problems when time is short.",
    "interviewWhy": "Binary Search Tree appears constantly in screening rounds.",
    "problems": [
      {
        "slug": "search-in-a-binary-search-tree",
        "title": "Search in a Binary Search Tree",
        "lc": 700,
        "difficulty": "Easy",
        "stars": 3
      },
      {
        "slug": "delete-node-in-a-bst",
        "title": "Delete Node in a BST",
        "lc": 450,
        "difficulty": "Medium",
        "stars": 4
      }
    ]
  },
  {
    "slug": "graph",
    "title": "Graph DFS / BFS",
    "order": 12,
    "icon": "Share2",
    "concepts": "Components and multi-source BFS.",
    "signal": "Components and multi-source BFS.",
    "overview": "This LeetCode 75 section focuses on Graph DFS / BFS. Master the pattern, then finish every problem below — especially those marked 5 stars (must-do).",
    "whenToUse": [
      "You see a problem that fits: Components and multi-source BFS.",
      "You want a structured LeetCode 75 study path",
      "Interview prep with high-frequency patterns"
    ],
    "template": "// Graph DFS / BFS — LeetCode 75\n// Restate → pick pattern → dry-run → code → edge cases",
    "tip": "Prioritize 5-star problems when time is short.",
    "interviewWhy": "Graph DFS / BFS appears constantly in screening rounds.",
    "problems": [
      {
        "slug": "keys-and-rooms",
        "title": "Keys and Rooms",
        "lc": 841,
        "difficulty": "Medium",
        "stars": 4
      },
      {
        "slug": "number-of-provinces",
        "title": "Number of Provinces",
        "lc": 547,
        "difficulty": "Medium",
        "stars": 5
      },
      {
        "slug": "reorder-routes-to-make-all-paths-lead-to-the-city-zero",
        "title": "Reorder Routes to Make All Paths Lead to the City Zero",
        "lc": 1466,
        "difficulty": "Medium",
        "stars": 4
      },
      {
        "slug": "evaluate-division",
        "title": "Evaluate Division",
        "lc": 399,
        "difficulty": "Medium",
        "stars": 4
      },
      {
        "slug": "nearest-exit-from-entrance-in-maze",
        "title": "Nearest Exit from Entrance in Maze",
        "lc": 1926,
        "difficulty": "Medium",
        "stars": 4
      },
      {
        "slug": "rotting-oranges",
        "title": "Rotting Oranges",
        "lc": 994,
        "difficulty": "Medium",
        "stars": 5
      }
    ]
  },
  {
    "slug": "heap",
    "title": "Heap / Priority Queue",
    "order": 13,
    "icon": "Boxes",
    "concepts": "Top-K and scheduling.",
    "signal": "Top-K and scheduling.",
    "overview": "This LeetCode 75 section focuses on Heap / Priority Queue. Master the pattern, then finish every problem below — especially those marked 5 stars (must-do).",
    "whenToUse": [
      "You see a problem that fits: Top-K and scheduling.",
      "You want a structured LeetCode 75 study path",
      "Interview prep with high-frequency patterns"
    ],
    "template": "// Heap / Priority Queue — LeetCode 75\n// Restate → pick pattern → dry-run → code → edge cases",
    "tip": "Prioritize 5-star problems when time is short.",
    "interviewWhy": "Heap / Priority Queue appears constantly in screening rounds.",
    "problems": [
      {
        "slug": "kth-largest-element-in-an-array",
        "title": "Kth Largest Element in an Array",
        "lc": 215,
        "difficulty": "Medium",
        "stars": 5
      },
      {
        "slug": "smallest-number-in-infinite-set",
        "title": "Smallest Number in Infinite Set",
        "lc": 2336,
        "difficulty": "Medium",
        "stars": 4
      },
      {
        "slug": "maximum-subsequence-score",
        "title": "Maximum Subsequence Score",
        "lc": 2542,
        "difficulty": "Medium",
        "stars": 4
      },
      {
        "slug": "total-cost-to-hire-k-workers",
        "title": "Total Cost to Hire K Workers",
        "lc": 2462,
        "difficulty": "Medium",
        "stars": 4
      }
    ]
  },
  {
    "slug": "binary-search",
    "title": "Binary Search",
    "order": 14,
    "icon": "Search",
    "concepts": "Search space reduction.",
    "signal": "Search space reduction.",
    "overview": "This LeetCode 75 section focuses on Binary Search. Master the pattern, then finish every problem below — especially those marked 5 stars (must-do).",
    "whenToUse": [
      "You see a problem that fits: Search space reduction.",
      "You want a structured LeetCode 75 study path",
      "Interview prep with high-frequency patterns"
    ],
    "template": "// Binary Search — LeetCode 75\n// Restate → pick pattern → dry-run → code → edge cases",
    "tip": "Prioritize 5-star problems when time is short.",
    "interviewWhy": "Binary Search appears constantly in screening rounds.",
    "problems": [
      {
        "slug": "guess-number-higher-or-lower",
        "title": "Guess Number Higher or Lower",
        "lc": 374,
        "difficulty": "Easy",
        "stars": 3
      },
      {
        "slug": "successful-pairs-of-spells-and-potions",
        "title": "Successful Pairs of Spells and Potions",
        "lc": 2300,
        "difficulty": "Medium",
        "stars": 4
      },
      {
        "slug": "find-peak-element",
        "title": "Find Peak Element",
        "lc": 162,
        "difficulty": "Medium",
        "stars": 4
      },
      {
        "slug": "koko-eating-bananas",
        "title": "Koko Eating Bananas",
        "lc": 875,
        "difficulty": "Medium",
        "stars": 5
      }
    ]
  },
  {
    "slug": "backtracking",
    "title": "Backtracking",
    "order": 15,
    "icon": "Spline",
    "concepts": "Choose explore undo.",
    "signal": "Choose explore undo.",
    "overview": "This LeetCode 75 section focuses on Backtracking. Master the pattern, then finish every problem below — especially those marked 5 stars (must-do).",
    "whenToUse": [
      "You see a problem that fits: Choose explore undo.",
      "You want a structured LeetCode 75 study path",
      "Interview prep with high-frequency patterns"
    ],
    "template": "// Backtracking — LeetCode 75\n// Restate → pick pattern → dry-run → code → edge cases",
    "tip": "Prioritize 5-star problems when time is short.",
    "interviewWhy": "Backtracking appears constantly in screening rounds.",
    "problems": [
      {
        "slug": "letter-combinations-of-a-phone-number",
        "title": "Letter Combinations of a Phone Number",
        "lc": 17,
        "difficulty": "Medium",
        "stars": 4
      },
      {
        "slug": "combination-sum-iii",
        "title": "Combination Sum III",
        "lc": 216,
        "difficulty": "Medium",
        "stars": 5
      }
    ]
  },
  {
    "slug": "dp-1d",
    "title": "DP — 1D",
    "order": 16,
    "icon": "Spline",
    "concepts": "Linear dynamic programming.",
    "signal": "Linear dynamic programming.",
    "overview": "This LeetCode 75 section focuses on DP — 1D. Master the pattern, then finish every problem below — especially those marked 5 stars (must-do).",
    "whenToUse": [
      "You see a problem that fits: Linear dynamic programming.",
      "You want a structured LeetCode 75 study path",
      "Interview prep with high-frequency patterns"
    ],
    "template": "// DP — 1D — LeetCode 75\n// Restate → pick pattern → dry-run → code → edge cases",
    "tip": "Prioritize 5-star problems when time is short.",
    "interviewWhy": "DP — 1D appears constantly in screening rounds.",
    "problems": [
      {
        "slug": "n-th-tribonacci-number",
        "title": "N-th Tribonacci Number",
        "lc": 1137,
        "difficulty": "Easy",
        "stars": 3
      },
      {
        "slug": "min-cost-climbing-stairs",
        "title": "Min Cost Climbing Stairs",
        "lc": 746,
        "difficulty": "Easy",
        "stars": 3
      },
      {
        "slug": "house-robber",
        "title": "House Robber",
        "lc": 198,
        "difficulty": "Medium",
        "stars": 5
      },
      {
        "slug": "domino-and-tromino-tiling",
        "title": "Domino and Tromino Tiling",
        "lc": 790,
        "difficulty": "Medium",
        "stars": 4
      }
    ]
  },
  {
    "slug": "dp-multi",
    "title": "DP — Multidimensional",
    "order": 17,
    "icon": "Spline",
    "concepts": "Grid and string DP.",
    "signal": "Grid and string DP.",
    "overview": "This LeetCode 75 section focuses on DP — Multidimensional. Master the pattern, then finish every problem below — especially those marked 5 stars (must-do).",
    "whenToUse": [
      "You see a problem that fits: Grid and string DP.",
      "You want a structured LeetCode 75 study path",
      "Interview prep with high-frequency patterns"
    ],
    "template": "// DP — Multidimensional — LeetCode 75\n// Restate → pick pattern → dry-run → code → edge cases",
    "tip": "Prioritize 5-star problems when time is short.",
    "interviewWhy": "DP — Multidimensional appears constantly in screening rounds.",
    "problems": [
      {
        "slug": "unique-paths",
        "title": "Unique Paths",
        "lc": 62,
        "difficulty": "Medium",
        "stars": 4
      },
      {
        "slug": "longest-common-subsequence",
        "title": "Longest Common Subsequence",
        "lc": 1143,
        "difficulty": "Medium",
        "stars": 5
      },
      {
        "slug": "best-time-to-buy-and-sell-stock-with-transaction-fee",
        "title": "Best Time to Buy and Sell Stock with Transaction Fee",
        "lc": 714,
        "difficulty": "Medium",
        "stars": 4
      },
      {
        "slug": "edit-distance",
        "title": "Edit Distance",
        "lc": 72,
        "difficulty": "Medium",
        "stars": 5
      }
    ]
  },
  {
    "slug": "bit",
    "title": "Bit Manipulation",
    "order": 18,
    "icon": "Hash",
    "concepts": "XOR and bit counts.",
    "signal": "XOR and bit counts.",
    "overview": "This LeetCode 75 section focuses on Bit Manipulation. Master the pattern, then finish every problem below — especially those marked 5 stars (must-do).",
    "whenToUse": [
      "You see a problem that fits: XOR and bit counts.",
      "You want a structured LeetCode 75 study path",
      "Interview prep with high-frequency patterns"
    ],
    "template": "// Bit Manipulation — LeetCode 75\n// Restate → pick pattern → dry-run → code → edge cases",
    "tip": "Prioritize 5-star problems when time is short.",
    "interviewWhy": "Bit Manipulation appears constantly in screening rounds.",
    "problems": [
      {
        "slug": "counting-bits",
        "title": "Counting Bits",
        "lc": 338,
        "difficulty": "Easy",
        "stars": 5
      },
      {
        "slug": "single-number",
        "title": "Single Number",
        "lc": 136,
        "difficulty": "Easy",
        "stars": 3
      },
      {
        "slug": "minimum-flips-to-make-a-or-b-equal-to-c",
        "title": "Minimum Flips to Make a OR b Equal to c",
        "lc": 1318,
        "difficulty": "Medium",
        "stars": 4
      }
    ]
  },
  {
    "slug": "trie",
    "title": "Trie",
    "order": 19,
    "icon": "GitBranch",
    "concepts": "Prefix trees.",
    "signal": "Prefix trees.",
    "overview": "This LeetCode 75 section focuses on Trie. Master the pattern, then finish every problem below — especially those marked 5 stars (must-do).",
    "whenToUse": [
      "You see a problem that fits: Prefix trees.",
      "You want a structured LeetCode 75 study path",
      "Interview prep with high-frequency patterns"
    ],
    "template": "// Trie — LeetCode 75\n// Restate → pick pattern → dry-run → code → edge cases",
    "tip": "Prioritize 5-star problems when time is short.",
    "interviewWhy": "Trie appears constantly in screening rounds.",
    "problems": [
      {
        "slug": "implement-trie-prefix-tree",
        "title": "Implement Trie (Prefix Tree)",
        "lc": 208,
        "difficulty": "Medium",
        "stars": 5
      },
      {
        "slug": "search-suggestions-system",
        "title": "Search Suggestions System",
        "lc": 1268,
        "difficulty": "Medium",
        "stars": 4
      }
    ]
  },
  {
    "slug": "intervals",
    "title": "Intervals",
    "order": 20,
    "icon": "Clock",
    "concepts": "Overlap and greedy intervals.",
    "signal": "Overlap and greedy intervals.",
    "overview": "This LeetCode 75 section focuses on Intervals. Master the pattern, then finish every problem below — especially those marked 5 stars (must-do).",
    "whenToUse": [
      "You see a problem that fits: Overlap and greedy intervals.",
      "You want a structured LeetCode 75 study path",
      "Interview prep with high-frequency patterns"
    ],
    "template": "// Intervals — LeetCode 75\n// Restate → pick pattern → dry-run → code → edge cases",
    "tip": "Prioritize 5-star problems when time is short.",
    "interviewWhy": "Intervals appears constantly in screening rounds.",
    "problems": [
      {
        "slug": "non-overlapping-intervals",
        "title": "Non-overlapping Intervals",
        "lc": 435,
        "difficulty": "Medium",
        "stars": 5
      }
    ]
  },
  {
    "slug": "monotonic-stack",
    "title": "Monotonic Stack",
    "order": 21,
    "icon": "Layers",
    "concepts": "Next greater patterns.",
    "signal": "Next greater patterns.",
    "overview": "This LeetCode 75 section focuses on Monotonic Stack. Master the pattern, then finish every problem below — especially those marked 5 stars (must-do).",
    "whenToUse": [
      "You see a problem that fits: Next greater patterns.",
      "You want a structured LeetCode 75 study path",
      "Interview prep with high-frequency patterns"
    ],
    "template": "// Monotonic Stack — LeetCode 75\n// Restate → pick pattern → dry-run → code → edge cases",
    "tip": "Prioritize 5-star problems when time is short.",
    "interviewWhy": "Monotonic Stack appears constantly in screening rounds.",
    "problems": [
      {
        "slug": "daily-temperatures",
        "title": "Daily Temperatures",
        "lc": 739,
        "difficulty": "Medium",
        "stars": 5
      },
      {
        "slug": "online-stock-span",
        "title": "Online Stock Span",
        "lc": 901,
        "difficulty": "Medium",
        "stars": 4
      }
    ]
  },
  {
    "slug": "matrix",
    "title": "Matrix",
    "order": 22,
    "icon": "Boxes",
    "concepts": "Grid BFS / DP.",
    "signal": "Grid BFS / DP.",
    "overview": "This LeetCode 75 section focuses on Matrix. Master the pattern, then finish every problem below — especially those marked 5 stars (must-do).",
    "whenToUse": [
      "You see a problem that fits: Grid BFS / DP.",
      "You want a structured LeetCode 75 study path",
      "Interview prep with high-frequency patterns"
    ],
    "template": "// Matrix — LeetCode 75\n// Restate → pick pattern → dry-run → code → edge cases",
    "tip": "Prioritize 5-star problems when time is short.",
    "interviewWhy": "Matrix appears constantly in screening rounds.",
    "problems": [
      {
        "slug": "01-matrix",
        "title": "01 Matrix",
        "lc": 542,
        "difficulty": "Medium",
        "stars": 5
      }
    ]
  }
];

export const lc75MustDoSlugs = [
  "product-of-array-except-self",
  "container-with-most-water",
  "move-zeroes",
  "longest-subarray-of-1-s-after-deleting-one-element",
  "find-pivot-index",
  "determine-if-two-strings-are-close",
  "decode-string",
  "asteroid-collision",
  "reverse-linked-list",
  "maximum-twin-sum-of-a-linked-list",
  "path-sum-iii",
  "lowest-common-ancestor-of-a-binary-tree",
  "number-of-provinces",
  "rotting-oranges",
  "kth-largest-element-in-an-array",
  "koko-eating-bananas",
  "combination-sum-iii",
  "house-robber",
  "longest-common-subsequence",
  "edit-distance",
  "counting-bits",
  "implement-trie-prefix-tree",
  "daily-temperatures",
  "non-overlapping-intervals",
  "01-matrix",
];
