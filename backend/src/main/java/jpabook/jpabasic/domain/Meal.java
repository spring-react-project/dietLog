package jpabook.jpabasic.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "meals")
public class Meal extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MealType type;


//    음식 선택
    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "food_id",nullable = false)
    private Food food;

    @Column(nullable = false)
    private Integer calories;

    @Column(columnDefinition = "TEXT")
    private String memo;

    @Builder
    private Meal(LocalDate date, MealType type, Food food,  String memo) {
        this.date = date;
        this.type = type;
        this.food = food;
        this.memo = memo;
        this.calories = food.getCalories();
    }

    public void update(LocalDate date, MealType type, Food food,  String memo) {
        this.date = date;
        this.type = type;
        this.food = food;
        this.memo = memo;
        this.calories =food.getCalories();
        this.memo = memo;
    }

    public String getFoodName() {
        return food.getName();
    }

    public String getIconKey() {
        return food.getIconKey();
    }

}
