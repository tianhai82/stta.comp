package stta

import (
	"time"
)

type Sex string

const (
	Male   Sex = "male"
	Female Sex = "female"
)

const Before = "before"
const After = "after"

type Competition struct {
	Id                   int        `json:"id"`
	RegistrationDeadline time.Time  `json:"registrationDeadline"`
	Name                 string     `json:"name"`
	MaleCategories       []Category `json:"maleCategories"`
	FemaleCategories     []Category `json:"femaleCategories"`
	Admins               []Admin    `json:"admins"`
}

type Category struct {
	Name        string    `json:"name"`
	Dob         time.Time `json:"dob"`
	Sex         string    `json:"sex"`
	BeforeAfter string    `json:"beforeAfter"`
}

type Admin struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

type Player struct {
	Name         string    `json:"name"`
	Sex          string    `json:"sex"`
	ChineseName  string    `json:"chineseName"`
	MobileNo     string    `json:"mobileNo"`
	HomeNo       string    `json:"homeNo"`
	Nric         string    `json:"nric"`
	Dob          time.Time `json:"dob"`
	School       string    `json:"school"`
	Address      string    `json:"address"`
	Email        string    `json:"email"`
	RatingPoints int       `json:"ratingPoints"`
	Ranking      int       `json:"ranking"`
}

type Registration struct {
	Id                  int        `json:"id"`
	PlayerParticipating Player     `json:"playerParticipating"`
	CompetitionId       int        `json:"competitionId"`
	CategoriesJoined    []Category `json:"categoriesJoined"`
}
