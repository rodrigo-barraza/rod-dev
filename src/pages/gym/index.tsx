import React from 'react'
import { useState, useEffect } from 'react'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import UtilityLibrary from '@/libraries/UtilityLibrary'
import GymApiLibrary from '@/libraries/GymApiLibrary'
import ButtonComponent from '@/components/ButtonComponent/ButtonComponent'
import InputComponent from '@/components/InputComponent/InputComponent'
import style from './index.module.scss'
import ExerciseCollection from '@/collections/ExerciseCollection4'
import DialogComponent from '@/components/DialogComponent'

import ExerciseComponent from '@/components/ExerciseComponent/ExerciseComponent'
import SeoHeadComponent from '@/components/SeoHeadComponent/SeoHeadComponent'
import type { Meta, Exercise, JournalEntry, JournalMap, GymSet } from '@/types/types'

interface GymPageProps {
    meta: Meta;
}

export const getServerSideProps: GetServerSideProps<GymPageProps> = async (context: GetServerSidePropsContext) => {
  const metaProps = UtilityLibrary.buildServerSideMetaProps(context, {
      title: 'Gym Tracker',
      description: 'Gym exercise tracking and journal.',
      keywords: 'gym, exercise, tracking, journal',
  });
  return { props: { ...metaProps.props } };
}


export default function Gym({ meta }: GymPageProps) {
    const router = useRouter()
    const [gymExercises] = useState<Exercise[]>(ExerciseCollection)
    const [trackList, setTrackList] = useState<Exercise[]>([])
    const [weight, setWeight] = useState('')
    const [reps, setReps] = useState('')

    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
    const [selectedType, setSelectedType] = useState('')
    const [selectedEquipment, setSelectedEquipment] = useState('')
    const [selectedPosition, setSelectedPosition] = useState('')
    const [selectedStyle, setSelectedStyle] = useState('')
    const [selectedStance, setSelectedStance] = useState('')
    const [selectedForm, setSelectedForm] = useState('')

    const [originalJournal, setOriginalJournal] = useState<GymSet[]>([])
    const [journal, setJournal] = useState<JournalMap>({})
    const [isModalOpen, setIsModalOpen] = useState<boolean | string>(false)
    const [exerciseStep, setExerciseStep] = useState('exercises')
    const [subtitle, setSubtitle] = useState('')
    const [averageTotalVolume, setAverageTotalVolume] = useState<number | string>(0)

    const [today] = useState(UtilityLibrary.todayISOString())

    async function getJournal() {
        const { data } = await GymApiLibrary.getJournal()
        if (data) {
            setOriginalJournal(data)
            const superExercises: JournalMap = {}
            data.slice(0, 1000).forEach((set: GymSet) => {
                const differenceInDays = UtilityLibrary.daysSince(set.date)
                const date = UtilityLibrary.toISODateString(set.date)
                const exerciseKey = `${set.exercise}`

                if (!superExercises[date]) {
                    superExercises[date] = {}
                } 
                if (superExercises[date]) {
                    if (!superExercises[date][exerciseKey]) {
                        superExercises[date][exerciseKey] = {
                            id: set.id,
                            sets: [],
                            date: set.date,
                            exercise: set.exercise,
                            part: 'x',
                            position: set.position,
                            stance: set.stance,
                            style: set.style,
                            form: set.form,
                            equipment: set.equipment,
                            daysSinceLastExercise: differenceInDays,
                        }
                    }
                    superExercises[date][exerciseKey].sets.unshift(set)
                }
            })
            setJournal(superExercises)
            setAverageTotalVolume(calculateAverageTotalDailyVolume(superExercises))
        }
    }

    function findLastExerciseEntry(exerciseName: string, exerciseDate: string): JournalEntry | null {
        let lastEntry: JournalEntry | null = null
        Object.values(journal).forEach((day) => {
            Object.values(day).forEach((dayExercise) => {
                if (dayExercise.exercise == exerciseName && UtilityLibrary.toISODateString(dayExercise.date) !== exerciseDate) {
                    if (lastEntry === null || dayExercise.date > lastEntry.date) {
                      lastEntry = dayExercise
                    }
                }
            })
        })
        return lastEntry
    }

    function returnRoutines(): string[] {
        const routines: string[] = []
        gymExercises.forEach((entry) => {
            if (!routines.includes(entry.type)) {
            routines.push(entry.type)
            }
        })
        return routines
    }

    function openTrackModal(type: string) {
        setIsModalOpen(true)
        setSelectedType(type)
        const filtered: Exercise[] = []
        gymExercises.forEach((entry) => {
            if (entry.type === type) {
            filtered.push(entry)
            }
        })
        setTrackList(filtered)
    }

    function clearSelectedExercise() {
        setSelectedExercise(null)
        setSelectedPosition('')
        setSelectedEquipment('')
        setSelectedStyle('')
        setSelectedStance('')
        setSelectedForm('')
    }

    function closeTrackModal() {
        setTrackList([])
        clearSelectedExercise()
        setIsModalOpen(false)
    }

    function lastExerciseEntry(exercise: Exercise): JournalEntry | null {
        let lastEntry: JournalEntry | null = null
        Object.values(journal).forEach((exercises) => {
            Object.values(exercises).forEach((entry) => {
                if (entry.exercise == exercise.name) {
                    if (lastEntry === null || entry.date > lastEntry.date) {
                      lastEntry = entry
                    }
                }
            })
        })
        return lastEntry
    }

    async function logSet() {
        if (!selectedExercise) return
        await GymApiLibrary.postJournal(selectedExercise.name, reps, weight, 'lbs', selectedStyle, selectedStance, selectedEquipment, selectedPosition)
        await getJournal()
        setReps('')
    }

    function daySinceLastExercise(workout: Exercise): string {
        let days = '(...)'
        let lowestExercise: JournalEntry | null = null
        Object.values(journal).forEach((exercises) => {
            Object.values(exercises).forEach((exercise) => {
                if (exercise.exercise == workout.name) {
                    if (lowestExercise === null || (exercise.daysSinceLastExercise ?? Infinity) < (lowestExercise.daysSinceLastExercise ?? Infinity)) {
                      lowestExercise = exercise
                      days = `(${exercise?.daysSinceLastExercise})`
                    }
                }
            })
        })
        return days
    }

    function calculateAverageTotalDailyVolume(currentJournal: JournalMap): string {
        let totalAverageVolume = 0
        Object.keys(currentJournal).forEach((date) => {
            let dayVolume = 0
            Object.keys(currentJournal[date]).forEach((day) => {
                dayVolume += UtilityLibrary.calculateTotalVolume(currentJournal[date][day].sets)
            })
            totalAverageVolume += dayVolume
        })
        return (totalAverageVolume / Object.keys(currentJournal).length).toFixed(1)
    }

    useEffect(() => {
        if (!selectedExercise) {
            setExerciseStep('exercises')
        } else if (selectedExercise && selectedExercise.form?.length && !selectedForm) {
            setExerciseStep('forms')
        } else if (selectedExercise && selectedExercise.style?.length && !selectedStyle) {
            setExerciseStep('styles')
        } else if (selectedExercise && selectedExercise.stance?.length && !selectedStance) {
            setExerciseStep('stances')
        } else if (selectedExercise && selectedExercise.position?.length && !selectedPosition) {
            setExerciseStep('positions')
        } else if (selectedExercise && selectedExercise.equipment.length && !selectedEquipment) {
            setExerciseStep('equipment')
        } else if (selectedExercise && selectedPosition && selectedEquipment) {
            setExerciseStep('log')
        }

        setSubtitle(UtilityLibrary.buildExerciseSubtitle(selectedExercise))

        const newQuery: Record<string, string> = {}
        // set query parameters
        if (selectedExercise) {
            newQuery.exercise = selectedExercise.name
        }
        if (selectedStance) {
            newQuery.stance = selectedStance
        }
        if (selectedStyle) {
            newQuery.style = selectedStyle
        }
        if (selectedPosition) {
            newQuery.position = selectedPosition
        }
        if (selectedEquipment) {
            newQuery.equipment = selectedEquipment
        }
        if (selectedForm) {
            newQuery.form = selectedForm
        }
        
        const queryString = new URLSearchParams(newQuery).toString()
        window.history.replaceState(
            { url: `${router.pathname}?${queryString}`, as: `${router.asPath}?${queryString}`, options: { shallow: true } },
            '',
            `${router.pathname}?${queryString}`
        )
        if (!selectedEquipment && !selectedPosition && !selectedStance && !selectedStyle && !selectedForm && !selectedExercise) {
            window.history.replaceState({}, '', router.pathname)
        }
    }, [selectedExercise, selectedPosition, selectedEquipment, selectedStyle, selectedStance, selectedForm])

    useEffect(() => {
        getJournal()
    }, [])

    useEffect(() => {
        if (router.query.exercise) {
            const foundExercise = gymExercises.find((exercise) => exercise.name === router.query.exercise)
            if (foundExercise) {
                setIsModalOpen(foundExercise.type)
                setSelectedExercise(foundExercise)
                if (router.query.stance) {
                    setSelectedStance(router.query.stance as string)
                }
                if (router.query.style) {
                    setSelectedStyle(router.query.style as string)
                }
                if (router.query.position) {
                    setSelectedPosition(router.query.position as string)
                }
                if (router.query.equipment) {
                    setSelectedEquipment(router.query.equipment as string)
                }
                if (router.query.form) {
                    setSelectedForm(router.query.form as string)
                }
            }
        }
    }, [])

    return (
    <main className={style.GymPage}>
        <SeoHeadComponent meta={meta} />
        <div className="container">
            <div className="CardComponent">
                <h1>Gym Tracker</h1>
                <h2>Track:</h2>
                    <div className="routines">
                    { returnRoutines().map((type, routineIndex) => (
                        <ButtonComponent 
                        key={routineIndex}
                        className="mini blue"
                        label={UtilityLibrary.uppercase(type)}
                        type="button" 
                        onClick={() => openTrackModal(type)}
                        ></ButtonComponent>
                    ))}
                    </div>
                <h2>Log:</h2>
                {/* <p>{averageTotalVolume}</p> */}
                <div className="GymList">
                    {Object.keys(journal)?.map((date, daysIndex) => (
                        <div key={daysIndex}>
                        <h2>{date}</h2>
                        <p>Daily Volume: {UtilityLibrary.decimalSeparator(UtilityLibrary.calculateTotalDayVolume(journal, date))} lbs</p>
                        <div className="experience-bar">
                            <div className="experience-bar-fill" style={{ width: `${UtilityLibrary.calculateTotalDayVolume(journal, date) / 300}%` }}></div>
                        </div>
                        <ul>
                            {Object.keys(journal[date])?.map((entry, entryIndex) => (
                                <li key={entryIndex} className={`${UtilityLibrary.isToday(journal[date][entry].date) ? "today" : ""}`}>
                                    <ExerciseComponent entry={journal[date][entry]}></ExerciseComponent>
                                </li>
                            ))}
                        </ul>
                        </div>
                    ))}
                </div>
            </div>
            <DialogComponent show={isModalOpen}>
            { exerciseStep === 'exercises' && (
                <>
                    <header>
                        <h2>{UtilityLibrary.capitalize(selectedType)} Exercises</h2>
                    </header>
                    <div>
                    { trackList?.map((exercise, index) => (
                        <ButtonComponent 
                        key={index}
                        className="new neutral"
                        label={`${daySinceLastExercise(exercise)} ${exercise.name}`}
                        type="button" 
                        onClick={() => setSelectedExercise(exercise)}
                        ></ButtonComponent>
                    ))}
                    </div>
                    <footer>
                        <ButtonComponent 
                        className="mini negative"
                        label="Cancel"
                        type="button" 
                        onClick={() => closeTrackModal()}
                        ></ButtonComponent>
                    </footer>
                </>
            )}
            { exerciseStep === 'forms' && selectedExercise && (
                <>
                    <header>
                        <h2>{UtilityLibrary.capitalize(selectedExercise.name)}: Form</h2>
                    </header>
                    <div>
                    { selectedExercise?.form?.map((form, index) => (
                        <ButtonComponent 
                            key={index}
                            className="new neutral"
                            label={form}
                            type="button" 
                            onClick={() => setSelectedForm(form)}
                        ></ButtonComponent>
                    ))}
                    </div>
                    <footer>
                        <ButtonComponent 
                            className="mini"
                            label="Back"
                            type="button" 
                            onClick={(() => {
                                clearSelectedExercise()
                            })}
                        ></ButtonComponent>
                        <ButtonComponent 
                            className="mini negative"
                            label="Cancel"
                            type="button" 
                            onClick={() => closeTrackModal()}
                        ></ButtonComponent>
                    </footer>
                </>
            )}
            { exerciseStep === 'styles' && selectedExercise && (
                <>
                    <header>
                        <h2>{UtilityLibrary.capitalize(selectedExercise.name)}: Style</h2>
                    </header>
                    <div>
                    { selectedExercise?.style?.map((styleOption, index) => (
                        <ButtonComponent 
                            key={index}
                            className="new neutral"
                            label={styleOption}
                            type="button" 
                            onClick={() => setSelectedStyle(styleOption)}
                        ></ButtonComponent>
                    ))}
                    </div>
                    <footer>
                        <ButtonComponent 
                            className="mini"
                            label="Back"
                            type="button" 
                            onClick={(() => {
                                clearSelectedExercise()
                            })}
                        ></ButtonComponent>
                        <ButtonComponent 
                            className="mini negative"
                            label="Cancel"
                            type="button" 
                            onClick={() => closeTrackModal()}
                        ></ButtonComponent>
                    </footer>
                </>
            )}
            { exerciseStep === 'stances' && selectedExercise && (
                <>
                    <header>
                        <h2>{UtilityLibrary.capitalize(selectedExercise.name)}: Stance</h2>
                    </header>
                    <div>
                    { selectedExercise?.stance?.map((stance, index) => (
                        <ButtonComponent 
                            key={index}
                            className="new neutral"
                            label={stance}
                            type="button" 
                            onClick={() => setSelectedStance(stance)}
                        ></ButtonComponent>
                    ))}
                    </div>
                    <footer>
                        <ButtonComponent 
                            className="mini"
                            label="Back"
                            type="button" 
                            onClick={(() => {
                                clearSelectedExercise()
                            })}
                        ></ButtonComponent>
                        <ButtonComponent 
                            className="mini negative"
                            label="Cancel"
                            type="button" 
                            onClick={() => closeTrackModal()}
                        ></ButtonComponent>
                    </footer>
                </>
            )}
            { exerciseStep === 'positions' && selectedExercise && (
                <>
                    <header>
                        <h2>{UtilityLibrary.capitalize(selectedExercise.name)}: Position</h2>
                    </header>
                    <div>
                    { selectedExercise?.position?.map((position, index) => (
                        <ButtonComponent 
                            key={index}
                            className="new neutral"
                            label={position}
                            type="button" 
                            onClick={() => setSelectedPosition(position)}
                        ></ButtonComponent>
                    ))}
                    </div>
                    <footer>
                        <ButtonComponent 
                            className="mini"
                            label="Back"
                            type="button" 
                            onClick={(() => {
                                clearSelectedExercise()
                            })}
                        ></ButtonComponent>
                        <ButtonComponent 
                            className="mini negative"
                            label="Cancel"
                            type="button" 
                            onClick={() => closeTrackModal()}
                        ></ButtonComponent>
                    </footer>
                </>
            )}
            { exerciseStep === 'equipment' && selectedExercise && (
                <>
                    <header>
                        <h2>{UtilityLibrary.capitalize(selectedExercise.name)}: Equipment</h2>
                    </header>
                    <div>
                    { selectedExercise?.equipment?.map((gear, index) => (
                        <ButtonComponent 
                            key={index}
                            className="new neutral"
                            label={gear}
                            type="button" 
                            onClick={() => setSelectedEquipment(gear)}
                        ></ButtonComponent>
                    ))}
                    </div>
                    <footer>
                        <ButtonComponent 
                            className="mini"
                            label="Back"
                            type="button" 
                            onClick={(() => {
                                clearSelectedExercise()
                            })}
                        ></ButtonComponent>
                        <ButtonComponent 
                            className="mini negative"
                            label="Cancel"
                            type="button" 
                            onClick={() => closeTrackModal()}
                        ></ButtonComponent>
                    </footer>
                </>
            )}
            { exerciseStep === 'log' && selectedExercise && (
                <>
                    <form className={style.logForm}>
                        <header>
                            <h2>{UtilityLibrary.capitalize(selectedExercise.name)}: Entry</h2>
                        </header>
                        <div className={style.blocks}>
                            { selectedForm && ( <div>{selectedForm}</div> ) }
                            { selectedStyle && ( <div>{selectedStyle}</div> ) }
                            { selectedStance && ( <div>{selectedStance}</div> ) }
                            { selectedPosition && ( <div>{selectedPosition}</div> ) }
                            { selectedEquipment && ( <div>{selectedEquipment}</div> ) }
                        </div>
                        <div>
                            <InputComponent 
                                label="Weight"
                                type="text"
                                value={weight} 
                                onChange={setWeight}
                            ></InputComponent>
                            <InputComponent 
                                label="Reps"
                                type="text"
                                value={reps} 
                                onChange={setReps}
                            ></InputComponent>
                        </div>
                        <footer>
                            <ButtonComponent 
                                className="mini negative"
                                label="Finish Sets"
                                type="button" 
                                onClick={() => closeTrackModal()}
                            ></ButtonComponent>
                            <ButtonComponent 
                                className="mini positive"
                                label="Log Set"
                                type="button" 
                                onClick={() => logSet()}
                            ></ButtonComponent>
                        </footer>
                    </form>
                    <div className="GymList">
                        <ul>
                            <li>
                                { journal && journal[today] && journal[today][selectedExercise.name] && (
                                    <ExerciseComponent entry={journal[today][selectedExercise.name]}></ExerciseComponent>
                                )}
                            </li>
                            <li>
                                <ExerciseComponent entry={findLastExerciseEntry(selectedExercise.name, today)} ghost={true}></ExerciseComponent>
                            </li>
                        </ul>
                    </div>
                </>
            )}
            </DialogComponent>
        </div>
    </main>
    )
}
