// DPIS Type Definitions (JavaScript with JSDoc)

/**
 * @typedef {Object} UserProfile
 * @property {string} id
 * @property {string} realName
 * @property {string} nickname
 * @property {string} email
 * @property {string} college
 * @property {number} xp
 * @property {number} level
 * @property {"serenity" | "mindful" | "harmony" | "balance"} house
 * @property {Achievement[]} achievements
 * @property {number} loginStreak
 * @property {number} totalLogins
 * @property {string} joinDate
 * @property {string} [avatar]
 */

/**
 * @typedef {Object} Achievement
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} icon
 * @property {"bronze" | "silver" | "gold" | "platinum"} type
 * @property {string} [unlockedAt]
 * @property {number} xpReward
 */

/**
 * @typedef {Object} MoodEntry
 * @property {string} id
 * @property {string} date
 * @property {"excellent" | "good" | "okay" | "struggling" | "difficult"} mood
 * @property {number} intensity
 * @property {string[]} tags
 * @property {string} [note]
 * @property {string[]} [activities]
 */

/**
 * @typedef {Object} ChatMessage
 * @property {string} id
 * @property {string} content
 * @property {"user" | "bot"} sender
 * @property {string} timestamp
 * @property {"text" | "assessment" | "resource" | "referral"} type
 * @property {{ assessmentType?: string, resourceId?: string, urgencyLevel?: "low" | "medium" | "high" | "critical" }} [metadata]
 */

/**
 * @typedef {Object} Assessment
 * @property {string} id
 * @property {"PHQ-9" | "GAD-7" | "stress-check" | "wellbeing"} type
 * @property {string} title
 * @property {string} description
 * @property {AssessmentQuestion[]} questions
 * @property {AssessmentScoring} scoring
 */

/**
 * @typedef {Object} AssessmentQuestion
 * @property {string} id
 * @property {string} question
 * @property {"likert" | "multiple-choice" | "yes-no"} type
 * @property {string[]} options
 * @property {number[]} scores
 */

/**
 * @typedef {Object} AssessmentScoring
 * @property {{ min: number, max: number, level: string, description: string, recommendations: string[] }[]} ranges
 */

/**
 * @typedef {Object} Resource
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {"video" | "audio" | "article" | "exercise" | "book"} type
 * @property {"meditation" | "breathing" | "music" | "reading" | "coping"} category
 * @property {"english" | "hindi" | "tamil" | "kashmiri" | "urdu"} language
 * @property {string} [url]
 * @property {string} [content]
 * @property {number} [duration]
 * @property {"beginner" | "intermediate" | "advanced"} difficulty
 * @property {string[]} tags
 * @property {number} rating
 * @property {number} completions
 */

/**
 * @typedef {Object} ForumPost
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {string} authorNickname
 * @property {string} authorHouse
 * @property {string} timestamp
 * @property {"general" | "academic" | "relationships" | "anxiety" | "depression" | "memes" | "achievements"} category
 * @property {number} upvotes
 * @property {ForumComment[]} comments
 * @property {string[]} tags
 * @property {boolean} isAnonymous
 */

/**
 * @typedef {Object} ForumComment
 * @property {string} id
 * @property {string} content
 * @property {string} authorNickname
 * @property {string} timestamp
 * @property {number} upvotes
 * @property {boolean} isAnonymous
 */

/**
 * @typedef {Object} GameSession
 * @property {string} id
 * @property {"memory" | "focus" | "breathing" | "mindfulness" | "cognitive"} gameType
 * @property {number} score
 * @property {number} duration
 * @property {string} completedAt
 * @property {number} xpEarned
 * @property {"easy" | "medium" | "hard"} difficulty
 */

/**
 * @typedef {Object} House
 * @property {"serenity" | "mindful" | "harmony" | "balance"} id
 * @property {string} name
 * @property {string} description
 * @property {string} color
 * @property {string} element
 * @property {string[]} values
 * @property {number} totalMembers
 * @property {number} totalXP
 * @property {number} rank
 */

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {"achievement" | "reminder" | "forum" | "assessment" | "system"} type
 * @property {string} title
 * @property {string} message
 * @property {string} timestamp
 * @property {boolean} read
 * @property {string} [actionUrl]
 */

/**
 * @typedef {Object} Challenge
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {"daily" | "weekly" | "monthly"} type
 * @property {"mindfulness" | "social" | "learning" | "activity"} category
 * @property {number} xpReward
 * @property {{ action: string, target: number, timeframe: string }} requirements
 * @property {number} progress
 * @property {boolean} completed
 * @property {string} expiresAt
 */

/**
 * @typedef {Object} Analytics
 * @property {string} userId
 * @property {string} sessionStart
 * @property {string} [sessionEnd]
 * @property {string[]} pagesVisited
 * @property {{ action: string, timestamp: string, metadata?: Object }[]} actionsPerformed
 * @property {number} moodEntries
 * @property {number} chatInteractions
 * @property {number} assessmentsCompleted
 * @property {number} resourcesAccessed
 * @property {number} gamesPlayed
 */

/**
 * @typedef {Object} CrisisResource
 * @property {string} id
 * @property {"hotline" | "chat" | "text" | "emergency"} type
 * @property {string} name
 * @property {string} description
 * @property {string} contact
 * @property {string} availability
 * @property {string[]} languages
 * @property {string} [location]
 * @property {number} priority
 */
