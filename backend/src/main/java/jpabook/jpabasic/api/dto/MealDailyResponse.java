package jpabook.jpabasic.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@AllArgsConstructor
public class MealDailyResponse {

    private LocalDate date;
    private int totalCalories;
    private List<MealItem> meals;



    @Getter
    @AllArgsConstructor
    public static class MealItem{
        private Long id;
        private String type;
        private String name;
        private int calories;
        private String memo;
        private String iconKey;
    }
}
