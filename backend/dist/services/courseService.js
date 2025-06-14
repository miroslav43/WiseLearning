"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourseWithCascade = exports.updateCourseTopics = void 0;
const index_1 = require("../index");
/**
 * Update course topics and lessons (complex operation)
 */
const updateCourseTopics = async (courseId, topics) => {
    // Get existing topics with all related data
    const existingTopics = await index_1.prisma.topic.findMany({
        where: { courseId },
        include: {
            lessons: {
                include: {
                    quiz: { include: { questions: true } },
                    assignment: true
                }
            }
        }
    });
    // Process topics
    for (let i = 0; i < topics.length; i++) {
        const topic = topics[i];
        if (topic.id) {
            // Update existing topic
            const existingTopic = existingTopics.find(t => t.id === topic.id);
            if (existingTopic) {
                await index_1.prisma.topic.update({
                    where: { id: topic.id },
                    data: {
                        title: topic.title,
                        description: topic.description,
                        orderIndex: i
                    }
                });
                // Process lessons for this topic
                if (topic.lessons) {
                    await updateTopicLessons(existingTopic, topic.lessons, courseId);
                }
            }
        }
        else {
            // Create new topic
            const createdTopic = await index_1.prisma.topic.create({
                data: {
                    courseId,
                    title: topic.title,
                    description: topic.description,
                    orderIndex: i
                }
            });
            // Create lessons for new topic
            if (topic.lessons) {
                await createTopicLessons(createdTopic.id, topic.lessons, courseId);
            }
        }
    }
    // Delete topics that are no longer in the list
    const topicIdsToKeep = topics.map(t => t.id).filter(Boolean);
    const topicsToDelete = existingTopics.filter(t => !topicIdsToKeep.includes(t.id));
    for (const topicToDelete of topicsToDelete) {
        await deleteTopicWithLessons(topicToDelete);
    }
};
exports.updateCourseTopics = updateCourseTopics;
/**
 * Update lessons for an existing topic
 */
const updateTopicLessons = async (existingTopic, lessons, courseId) => {
    for (let j = 0; j < lessons.length; j++) {
        const lesson = lessons[j];
        if (lesson.id) {
            // Update existing lesson
            const existingLesson = existingTopic.lessons.find((l) => l.id === lesson.id);
            if (existingLesson) {
                await index_1.prisma.lesson.update({
                    where: { id: lesson.id },
                    data: {
                        title: lesson.title,
                        description: lesson.description,
                        videoUrl: lesson.videoUrl,
                        content: lesson.content,
                        duration: lesson.duration,
                        orderIndex: j,
                        type: lesson.type
                    }
                });
                // Handle quiz and assignment updates
                await updateLessonContent(existingLesson, lesson);
            }
        }
        else {
            // Create new lesson
            await createLesson(existingTopic.id, lesson, j, courseId);
        }
    }
    // Delete lessons that are no longer in the list
    const lessonIdsToKeep = lessons.map(l => l.id).filter(Boolean);
    const lessonsToDelete = existingTopic.lessons.filter((l) => !lessonIdsToKeep.includes(l.id));
    for (const lessonToDelete of lessonsToDelete) {
        await deleteLessonWithContent(lessonToDelete);
    }
};
/**
 * Create lessons for a new topic
 */
const createTopicLessons = async (topicId, lessons, courseId) => {
    for (let j = 0; j < lessons.length; j++) {
        const lesson = lessons[j];
        await createLesson(topicId, lesson, j, courseId);
    }
};
/**
 * Create a single lesson with its content
 */
const createLesson = async (topicId, lesson, orderIndex, courseId) => {
    const createdLesson = await index_1.prisma.lesson.create({
        data: {
            topicId,
            title: lesson.title,
            description: lesson.description,
            videoUrl: lesson.videoUrl,
            content: lesson.content,
            duration: lesson.duration || 0,
            orderIndex,
            type: lesson.type || 'lesson',
            courseId
        }
    });
    // Create quiz if needed
    if (lesson.type === 'quiz' && lesson.quiz) {
        await createQuizWithQuestions(createdLesson.id, lesson.quiz);
    }
    // Create assignment if needed
    if (lesson.type === 'assignment' && lesson.assignment) {
        await createAssignment(createdLesson.id, lesson.assignment);
    }
};
/**
 * Update lesson quiz and assignment content
 */
const updateLessonContent = async (existingLesson, lesson) => {
    // Update quiz if exists
    if (lesson.type === 'quiz' && lesson.quiz) {
        if (existingLesson.quiz) {
            await index_1.prisma.quiz.update({
                where: { id: existingLesson.quiz.id },
                data: {
                    title: lesson.quiz.title,
                    description: lesson.quiz.description,
                    timeLimit: lesson.quiz.timeLimit
                }
            });
            // Update questions (simplified: delete and recreate)
            if (lesson.quiz.questions) {
                await index_1.prisma.question.deleteMany({
                    where: { quizId: existingLesson.quiz.id }
                });
                await createQuizQuestions(existingLesson.quiz.id, lesson.quiz.questions);
            }
        }
        else {
            // Create new quiz
            await createQuizWithQuestions(existingLesson.id, lesson.quiz);
        }
    }
    else if (existingLesson.quiz) {
        // Delete existing quiz if lesson type changed
        await deleteQuizWithQuestions(existingLesson.quiz);
    }
    // Update assignment if exists
    if (lesson.type === 'assignment' && lesson.assignment) {
        if (existingLesson.assignment) {
            await index_1.prisma.assignment.update({
                where: { id: existingLesson.assignment.id },
                data: {
                    title: lesson.assignment.title,
                    description: lesson.assignment.description,
                    dueDate: lesson.assignment.dueDate,
                    maxScore: lesson.assignment.maxScore,
                    allowFileUpload: lesson.assignment.allowFileUpload,
                    allowedFileTypes: lesson.assignment.allowedFileTypes,
                    unitTests: lesson.assignment.unitTests
                }
            });
        }
        else {
            // Create new assignment
            await createAssignment(existingLesson.id, lesson.assignment);
        }
    }
    else if (existingLesson.assignment) {
        // Delete existing assignment if lesson type changed
        await index_1.prisma.assignment.delete({
            where: { id: existingLesson.assignment.id }
        });
    }
};
/**
 * Create quiz with questions
 */
const createQuizWithQuestions = async (lessonId, quiz) => {
    const createdQuiz = await index_1.prisma.quiz.create({
        data: {
            lessonId,
            title: quiz.title,
            description: quiz.description,
            timeLimit: quiz.timeLimit
        }
    });
    if (quiz.questions) {
        await createQuizQuestions(createdQuiz.id, quiz.questions);
    }
};
/**
 * Create quiz questions
 */
const createQuizQuestions = async (quizId, questions) => {
    for (let k = 0; k < questions.length; k++) {
        const question = questions[k];
        await index_1.prisma.question.create({
            data: {
                quizId,
                questionText: question.questionText,
                type: question.type,
                options: question.options,
                correctOptions: question.correctOptions,
                orderIndex: k
            }
        });
    }
};
/**
 * Create assignment
 */
const createAssignment = async (lessonId, assignment) => {
    await index_1.prisma.assignment.create({
        data: {
            lessonId,
            title: assignment.title,
            description: assignment.description,
            dueDate: assignment.dueDate,
            maxScore: assignment.maxScore || 100,
            allowFileUpload: assignment.allowFileUpload !== false,
            allowedFileTypes: assignment.allowedFileTypes || [],
            unitTests: assignment.unitTests
        }
    });
};
/**
 * Delete quiz with all questions
 */
const deleteQuizWithQuestions = async (quiz) => {
    await index_1.prisma.question.deleteMany({
        where: { quizId: quiz.id }
    });
    await index_1.prisma.quiz.delete({
        where: { id: quiz.id }
    });
};
/**
 * Delete lesson with all content
 */
const deleteLessonWithContent = async (lesson) => {
    if (lesson.quiz) {
        await deleteQuizWithQuestions(lesson.quiz);
    }
    if (lesson.assignment) {
        await index_1.prisma.assignment.delete({
            where: { id: lesson.assignment.id }
        });
    }
    await index_1.prisma.lessonProgress.deleteMany({
        where: { lessonId: lesson.id }
    });
    await index_1.prisma.lesson.delete({
        where: { id: lesson.id }
    });
};
/**
 * Delete topic with all lessons
 */
const deleteTopicWithLessons = async (topic) => {
    for (const lesson of topic.lessons) {
        await deleteLessonWithContent(lesson);
    }
    await index_1.prisma.topic.delete({
        where: { id: topic.id }
    });
};
/**
 * Delete entire course with cascade
 */
const deleteCourseWithCascade = async (courseId) => {
    // Delete all related entities
    await index_1.prisma.enrollment.deleteMany({ where: { courseId } });
    await index_1.prisma.courseReview.deleteMany({ where: { courseId } });
    await index_1.prisma.certificate.deleteMany({ where: { courseId } });
    await index_1.prisma.bundleCourse.deleteMany({ where: { courseId } });
    await index_1.prisma.savedCourse.deleteMany({ where: { courseId } });
    await index_1.prisma.likedCourse.deleteMany({ where: { courseId } });
    // Get topics with all content
    const topics = await index_1.prisma.topic.findMany({
        where: { courseId },
        include: {
            lessons: {
                include: {
                    quiz: { include: { questions: true } },
                    assignment: true
                }
            }
        }
    });
    // Delete topics and their content
    for (const topic of topics) {
        await deleteTopicWithLessons(topic);
    }
    // Finally, delete the course
    await index_1.prisma.course.delete({ where: { id: courseId } });
};
exports.deleteCourseWithCascade = deleteCourseWithCascade;
