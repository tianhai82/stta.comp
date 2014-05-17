package stta

import (
	"time"
)

const (
	MALE   = "male"
	FEMALE = "female"
)

type Competition struct {
	StartDate, EndDate              time.Time
	CompetitionName, Referee, Venue string
}

type Categories struct {
	CategoryName string
	AgeLimit     int
	Gender       string
}
