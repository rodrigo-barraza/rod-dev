import type { Exercise } from '@/types/types';

const ExerciseCollection: Exercise[] = [
    {
        name: 'kickback',
        style: ['tricep'],
        stance: ['unilateral', 'bilateral'],
        equipment: ['cable rope', 'cable straight bar', 'dumbbell'],
        position: ['standing', 'seated'],
        type: 'push'
    },
    {
        name: 'pushdown',
        style: ['tricep'],
        stance: ['unilateral', 'bilateral'],
        equipment: ['cable rope', 'cable straight bar'],
        position: ['standing'],
        type: 'push'
    },
    {
        name: 'overhead extension',
        style: ['tricep'],
        stance: ['unilateral', 'bilateral'],
        equipment: ['dumbbell', 'barbell', 'cable', 'machine'],
        position: ['seated', 'standing', 'incline', 'decline', 'lying'],
        type: 'push'
    },
    {
        name: 'arm press',
        style: ['overhead', 'bench', 'military', 'arnold', 'push', 'push press'],
        stance: ['unilateral', 'bilateral'],
        equipment: ['chest', 'cable', 'dumbbell', 'barbell', 'machine'],
        position: ['seated', 'standing', 'incline', 'decline', 'lying'],
        type: 'push'
    },
    {
        name: 'dips',
        style: ['tricep', 'chest'],
        stance: ['unilateral', 'bilateral'],
        equipment: ['parallel bar', 'straight bar'],
        position: ['hanging'],
        type: 'push'
    },
    {
        name: 'chest fly',
        style: [],
        stance: ['unilateral', 'bilateral'],
        equipment: ['cable', 'dumbbell'],
        position: ['seated', 'standing', 'incline', 'decline', 'lying'],
        type: 'push' 
    },
    {
        name: 'curl',
        style: ['bicep', 'inner bicep', 'hammer', 'preacher', 'reverse', 'concentration'],
        stance: ['unilateral', 'bilateral'],
        equipment: ['cable', 'dumbbell', 'barbell'],
        position: ['seated', 'standing', 'incline'],
        type: 'pull'
    },
    {
        name: 'deadlift',
        style: ['romanian', 'sumo', 'straight leg'],
        stance: ['unilateral', 'bilateral'],
        equipment: ['barbell', 'dumbbell', 'smith machine', 'trap bar'],
        position: ['standing'],
        type: 'pull'
    },
    {
        name: 'rear delt fly',
        style: [],
        stance: ['unilateral', 'bilateral'],
        equipment: ['dumbbell', 'cable', 'machine'],
        position: ['seated', 'standing'],
        type: 'pull'
    },
    {
        name: 'shrug',
        style: [],
        stance: ['unilateral', 'bilateral'],
        equipment: ['dumbbell', 'barbell'],
        position: ['standing'],
        type: 'pull'
    },
    {
        name: 'lat pulldown',
        style: ['wide grip', 'close grip'],
        form:  ['underhand', 'overhand'],
        stance: ['unilateral', 'bilateral'],
        equipment: ['cable straight bar', 'machine'],
        position: ['seated', 'standing'],
        type: 'pull'
    },
    {
        name: 'lat raise',
        style: [],
        stance: ['unilateral', 'bilateral'],
        equipment: ['dumbbell', 'cable'],
        position: ['seated', 'standing'],
        type: 'pull'
    },
    {
        name: 'row',
        style: ['bent over', 'upright'],
        stance: ['unilateral', 'bilateral'],
        equipment: ['barbell', 'dumbbell', 'cable', 'machine', 't-bar'],
        position: ['standing', 'seated'],
        type: 'pull'
    },
    {
        name: 'pull up',
        form:  ['underhand', 'overhand'],
        style: ['wide grip', 'close grip'],
        stance: ['unilateral', 'bilateral'],
        equipment: ['pull up bar'],
        position: ['hanging'],
        type: 'pull'
    },
    {
        name: 'face pull',
        style: [],
        stance: ['unilateral', 'bilateral'],
        equipment: ['cable rope'],
        position: ['seated', 'standing'],
        type: 'pull'
    },
    {
        name: 'leg raise',
        style: [],
        stance: ['unilateral', 'bilateral'],
        equipment: ['captains chair', ],
        position: ['hanging', 'lying', 'seated'],
        type: 'core'
    },
    {
        name: 'leg curl',
        style: [],
        stance: ['unilateral', 'bilateral'],
        equipment: ['cable', 'machine'],
        position: ['seated', 'lying'],
        type: 'legs'
    },
    {
        name: 'leg extension',
        style: [],
        stance: ['unilateral', 'bilateral'],
        equipment: ['cable', 'machine'],
        position: ['seated'],
        type: 'legs'
    },
    {
        name: 'squat',
        style: ['front', 'back', 'sumo'],
        stance: ['unilateral', 'bilateral'],
        equipment: ['barbell', 'smith machine'],
        position: ['standing'],
        type: 'legs'
    },
    {
        name: 'leg press',
        style: [],
        stance: ['unilateral', 'bilateral'],
        equipment: ['machine'],
        position: ['seated'],
        type: 'legs'
    },
    {
        name: 'lateral leg raise',
        style: [],
        stance: ['unilateral'],
        equipment: ['resistance band', 'cable', 'machine'],
        position: ['seated', 'standing', 'lying'],
        type: 'legs'
    },
    {
        name: 'calf raise',
        style: [],
        stance: ['unilateral', 'bilateral'],
        equipment: ['dumbbell', 'barbell', 'smith machine'],
        position: ['seated', 'standing'],
        type: 'legs'
    },
    {
        name: 'roll out',
        style: [],
        stance: ['bilateral'],
        equipment: ['ab wheel'],
        position: ['kneeling', 'standing'],
        type: 'core'
    },
    {
        name: 'running',
        style: [],
        stance: [],
        equipment: ['elliptical', 'treadmill', 'track'],
        position: ['standing'],
        type: 'cardio'
    },
    {
        name: 'walking',
        style: [],
        stance: [],
        equipment: ['elliptical', 'treadmill', 'track'],
        position: ['standing'],
        type: 'cardio'
    },
    {
        name: 'cycling',
        style: [],
        stance: [],
        equipment: ['bicycle', 'exercise bike'],
        position: ['seated'],
        type: 'cardio'
    },
    {
        name: 'jump rope',
        style: [],
        stance: ['bilateral'],
        equipment: ['jump rope'],
        position: ['standing'],
        type: 'cardio'
    }
];

export default ExerciseCollection;
  