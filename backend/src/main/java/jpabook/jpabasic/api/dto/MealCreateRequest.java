package jpabook.jpabasic.api.dto;

import jpabook.jpabasic.domain.MealType;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class MealCreateRequest {
    private LocalDate date;
    private MealType type;
    private String name;
    private Integer calories;
    private String memo;
}
