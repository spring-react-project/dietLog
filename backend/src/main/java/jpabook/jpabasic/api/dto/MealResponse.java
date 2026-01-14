package jpabook.jpabasic.api.dto;

import jpabook.jpabasic.domain.Meal;
import jpabook.jpabasic.domain.MealType;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class MealResponse {

    private final Long id;
    private final LocalDate date;

    private final MealType type;
    private final String name;
    private final Integer calories;
    private final String memo;
    private final LocalDate createdAt;
    private final LocalDate updatedAt;

    public MealResponse(Meal meal) {
        this.id = meal.getId();
        this.date = meal.getDate();
        this.type = meal.getType();
        this.name = meal.getFood().getName();
        this.calories = meal.getCalories();
        this.memo = meal.getMemo();
        this.createdAt = meal.getCreatedAt();
        this.updatedAt = meal.getUpdatedAt();
    }

}
