import { Clothing, Instance, ObservedPeople, Topic, TopicGroupList } from '@/contracts/insights'

export const timeToSeconds = (timeStr: string): number => {
  const parts = timeStr.split(':')
  const h = parseInt(parts[0], 10)
  const m = parseInt(parts[1], 10)
  const s = parseFloat(parts[2])
  return h * 3600 + m * 60 + s
}

export const secondsToTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = (seconds % 60).toFixed(3) // Keeping three decimal places for precision

  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.padStart(6, '0')}`
}

export const calculateAppearancePercentage = (instances: Instance[], videoLengthSeconds: number): number => {
  if (!instances || instances.length === 0 || videoLengthSeconds === 0) return 0

  // Convert instances into time intervals
  const timeIntervals = instances.map(instance => ({
    start: timeToSeconds(instance.adjustedStart),
    end: timeToSeconds(instance.adjustedEnd),
  }))

  // Sort intervals by start time
  timeIntervals.sort((a, b) => a.start - b.start)

  // Merge overlapping intervals
  let mergedTime = 0
  let prevStart = timeIntervals[0].start
  let prevEnd = timeIntervals[0].end

  for (let i = 1; i < timeIntervals.length; i++) {
    const { start, end } = timeIntervals[i]

    if (start <= prevEnd) {
      // Overlapping interval: extend the current interval
      prevEnd = Math.max(prevEnd, end)
    } else {
      // Non-overlapping: add previous merged duration
      mergedTime += prevEnd - prevStart
      prevStart = start
      prevEnd = end
    }
  }

  // Add the last merged interval
  mergedTime += prevEnd - prevStart

  // Calculate percentage
  return (mergedTime / videoLengthSeconds) * 100
}

export const formatClothing = (clothing: Clothing[]): string[] => {
  return clothing.map(item => {
    const props = item.properties ? Object.values(item.properties).join(' ') : ''
    return props ? `${props} ${item.type}` : item.type
  })
}

export const populateObservedPeopleData = (people: ObservedPeople[]): ObservedPeople[] => {
  return people.map(person => ({
    ...person,
    clothingList: person.clothing ? formatClothing(person.clothing) : [],
  }))
}

export const groupTopics = (topics: Topic[]): TopicGroupList[] => {
  const uniqueIabNames = new Set(topics.map(topic => topic.iabName).filter(Boolean)) // Remove falsy values
  const iabGroups = [...uniqueIabNames]

  const topicsWithoutIAB = topics.filter(topic => !topic.iabName).map(topic => ({ id: topic.id, name: topic.name }))

  const groupedTopics = iabGroups.map(iabName => {
    const groupName = iabName?.split(' ')[0] || null
    const children = topics
      .filter(topic => topic.iabName === iabName)
      .map(topic => ({ id: topic.id, name: topic.name }))

    const isParentClickable = groupName !== null && children.some(child => child.name === groupName)
    const groupId = isParentClickable ? (topics.find(topic => topic.name === groupName)?.id ?? null) : null

    return {
      groupName,
      groupId,
      children: children.filter(child => child.name !== groupName), // Exclude group name from children if present
      isParentClickable,
    }
  })

  // Include topics that do not have an IAB classification
  if (topicsWithoutIAB.length) {
    groupedTopics.push({
      groupName: null,
      groupId: null,
      children: topicsWithoutIAB,
      isParentClickable: false,
    })
  }

  // Return modified topics list with updated topicList property
  return groupedTopics
}
