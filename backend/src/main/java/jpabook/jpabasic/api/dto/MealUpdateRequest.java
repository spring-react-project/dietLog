package jpabook.jpabasic.api.dto;

import jpabook.jpabasic.domain.MealType;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class MealUpdateRequest {
    private LocalDate date;
    private MealType type;
    private Long foodId;
    private String memo;
}


