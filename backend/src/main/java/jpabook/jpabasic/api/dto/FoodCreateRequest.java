package jpabook.jpabasic.api.dto;

import jpabook.jpabasic.domain.Meal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class FoodCreateRequest {

    private String name;
    private Integer calories;
    private String iconKey;
    private String category;


}
