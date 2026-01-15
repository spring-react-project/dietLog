package jpabook.jpabasic.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FoodSearchResponse {
    private String uid;
    private String foodCode;
    private String name;
    private String category;
    private Double kcal;
    private Double baseAmount;
    private String source;
    private String group;
}
