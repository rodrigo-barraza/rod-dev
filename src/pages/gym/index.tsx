import React from 'react'
import { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
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

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const metaProps = UtilityLibrary.buildServerSideMetaProps(context, {
      title: 'Gym Tracker',
      description: 'Gym exercise tracking and journal.',
      keywords: 'gym, exercise, tracking, journal',
  });
  return { props: { ...metaProps.props, guest: {} } };
}


export default function Gym(props) {
    const router = useRouter()
    const { meta, guest } = props
    const [gymExercises, setGymExercises] = useState(ExerciseCollection)
    const [isHidden, setIsHidden] = useState({})
    const [trackList, setTrackList] = useState([])
    const [weight, setWeight] = useState('')
    const [reps, setReps] = useState('')

    const [selectedExercise, setSelectedExercise] = useState('')
    const [selectedType, setSelectedType] = useState('')
    const [selectedEquipment, setSelectedEquipment] = useState('')
    const [selectedPosition, setSelectedPosition] = useState('')
    const [selectedStyle, setSelectedStyle] = useState('')
    const [selectedStance, setSelectedStance] = useState('')
    const [selectedForm, setSelectedForm] = useState('')

    const [originalJournal, setOriginalJournal] = useState([{}])
    const [journal, setJournal] = useState([{}])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [exerciseStep, setExerciseStep] = useState('exercises')
    const [subtitle, setSubtitle] = useState('')
    const [averageTotalVolume, setAverageTotalVolume] = useState(0)

    const [today, setToday] = useState(UtilityLibrary.todayISOString())

    async function getJournal() {
        const { data, error, response } = await GymApiLibrary.getJournal()
        if (data) {
            setOriginalJournal(data)
            const superExercises = {}
            data.slice(0, 1000).forEach((set, key) => {
                const differenceInDays = UtilityLibrary.daysSince(set.date)
                const date = UtilityLibrary.toISODateString(set.date)
                const exerciseKey = `${set.exercise}`

                if (!superExercises[date]) {
                    superExercises[date] = {}
                } 
                if (superExercises[date]) {
                    if (!superExercises[date][exerciseKey]) {
                        superExercises[date][exerciseKey] = {}
                        superExercises[date][exerciseKey].id = set.id
                        superExercises[date][exerciseKey].sets = []
                        superExercises[date][exerciseKey].date = set.date
                        superExercises[date][exerciseKey].exercise = set.exercise
                        superExercises[date][exerciseKey].part = 'x' // get part off another list
                        superExercises[date][exerciseKey].position = set.position
                        superExercises[date][exerciseKey].stance = set.stance
                        superExercises[date][exerciseKey].style = set.style
                        superExercises[date][exerciseKey].form = set.form
                        superExercises[date][exerciseKey].equipment = set.equipment
                        // calculate days since last exercise to x amount of days
                        superExercises[date][exerciseKey].daysSinceLastExercise = differenceInDays 
                    }
                    superExercises[date][exerciseKey].sets.unshift(set)
                }
            })
            setJournal(superExercises)
            setAverageTotalVolume(calculateAverageTotalDailyVolume(superExercises))
        }
    }

    function findLastExerciseEntry(exerciseName, exerciseDate) {
        let lastEntry = null
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

    function returnRoutines() {
        let routines = []
        gymExercises.forEach((entry: any) => {
            if (!routines.includes(entry.type)) {
            routines.push(entry.type)
            }
        })
        return routines
    }

    function openTrackModal(type) {
        setIsModalOpen(true)
        setSelectedType(type)
        let trackList = []
        gymExercises.forEach((entry: any) => {
            if (entry.type === type) {
            trackList.push(entry)
            }
        })
        setTrackList(trackList)
    }

    function clearSelectedExercise() {
        setSelectedExercise('')
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

    function lastExerciseEntry(exercise: any) {
        let lastEntry = null
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
        await GymApiLibrary.postJournal(selectedExercise.name, reps, weight, 'lbs', selectedStyle, selectedStance, selectedEquipment, selectedPosition)
        await getJournal()
        setReps('')
    }

    function daySinceLastExercise(workout) {
        let days = '(...)'
        let lowestExercise = null
        Object.values(journal).forEach((exercises) => {
            Object.values(exercises).forEach((exercise) => {
                if (exercise.exercise == workout.name) {
                    if (lowestExercise === null || exercise.daysSinceLastExercise < lowestExercise.daysSinceLastExercise) {
                      lowestExercise = exercise
                      days = `(${exercise?.daysSinceLastExercise})`
                    }
                }
            })
        })
        return days
    }

    function calculateAverageTotalVolume(currentJournal) {
        let totalVolume = 0
        let totalExercises = 0
        Object.values(currentJournal).forEach((day) => {
            Object.values(day).forEach((exercise) => {
                totalVolume += UtilityLibrary.calculateTotalVolume(exercise.sets)
                totalExercises++
            })
        })
        return (totalVolume / totalExercises).toFixed(1)
    }

    function calculateAverageTotalDailyVolume(currentJournal) {
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

    function calculateMedianTotalDailyVolume(currentJournal) {
        let totalVolume = []
        Object.keys(currentJournal).forEach((date) => {
            let dayVolume = 0
            Object.keys(currentJournal[date]).forEach((day) => {
                dayVolume += UtilityLibrary.calculateTotalVolume(currentJournal[date][day].sets)
            })
            totalVolume.push(dayVolume)
        })
        totalVolume.sort((a, b) => a - b)
        if (totalVolume.length % 2 === 0) {
            return totalVolume[totalVolume.length / 2].toFixed(1)
        } else {
            return totalVolume[(totalVolume.length - 1) / 2].toFixed(1) // fix to properly calculate median
        }
    }

    function calculateMedianTotalVolume(currentJournal) {
        let totalVolume = []
        Object.values(currentJournal).forEach((day) => {
            Object.values(day).forEach((exercise) => {
                totalVolume.push(UtilityLibrary.calculateTotalVolume(exercise.sets))
            })
        })
        totalVolume.sort((a, b) => a - b)
        return totalVolume[totalVolume.length / 2]
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

        const newQuery = { ...router.query }
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
            const selectedExercise = gymExercises.find((exercise) => exercise.name === router.query.exercise)
            if (selectedExercise) {
                setIsModalOpen(selectedExercise.type)
                setSelectedExercise(selectedExercise)
                if (router.query.stance) {
                    setSelectedStance(router.query.stance)
                }
                if (router.query.style) {
                    setSelectedStyle(router.query.style)
                }
                if (router.query.position) {
                    setSelectedPosition(router.query.position)
                }
                if (router.query.equipment) {
                    setSelectedEquipment(router.query.equipment)
                }
                if (router.query.form) {
                    setSelectedForm(router.query.form)
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
            { exerciseStep === 'forms' && (
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
            { exerciseStep === 'styles' && (
                <>
                    <header>
                        <h2>{UtilityLibrary.capitalize(selectedExercise.name)}: Style</h2>
                    </header>
                    <div>
                    { selectedExercise?.style?.map((style, index) => (
                        <ButtonComponent 
                            key={index}
                            className="new neutral"
                            label={style}
                            type="button" 
                            onClick={() => setSelectedStyle(style)}
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
            { exerciseStep === 'stances' && (
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
            { exerciseStep === 'positions' && (
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
            { exerciseStep === 'equipment' && (
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
            { exerciseStep === 'log' && (
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
