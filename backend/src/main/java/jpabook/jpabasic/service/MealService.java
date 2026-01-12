package jpabook.jpabasic.service;

import jpabook.jpabasic.api.dto.MealCreateRequest;
import jpabook.jpabasic.api.dto.MealDailyResponse;
import jpabook.jpabasic.api.dto.MealResponse;
import jpabook.jpabasic.api.dto.MealUpdateRequest;
import jpabook.jpabasic.domain.Meal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jpabook.jpabasic.repository.MealRepository;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MealService {

    private final MealRepository mealRepository;

//    생성
    public MealResponse create(MealCreateRequest req) {

        validate(req.getDate(),req.getType(),req.getName(),req.getCalories());

        Meal meal = Meal.builder()
                .date(req.getDate())
                .type(req.getType())
                .name(req.getName())
                .calories(req.getCalories())
                .memo(req.getMemo())
                .build();


        Meal saved = mealRepository.save(meal);
        return new MealResponse(saved);
    }

    @Transactional(readOnly = true)
    public MealDailyResponse findByDate(LocalDate date) {
        if(date==null) throw new IllegalArgumentException("date is required");

        List<Meal> meals = mealRepository.findAllByDateOrderByIdAsc(date);

        int total = meals.stream().mapToInt(m->m.getCalories()==null? 0: m.getCalories()).sum();


        List<MealDailyResponse.MealItem> items = meals.stream()
                .map(m->new MealDailyResponse.MealItem(
                        m.getId(),
                        m.getType().name(),
                        m.getName(),
                        m.getCalories()==null? 0: m.getCalories(),
                        m.getMemo()
                ))
                .toList();

        return  new MealDailyResponse(date,total,items);

    }


//    하나 찾기
    @Transactional(readOnly = true)
    public MealResponse findOne(Long id) {
        Meal meal= mealRepository.findById(id)
                .orElseThrow(()->new IllegalArgumentException("meal not found"+id));


        return new MealResponse(meal);
    }

//    업데이트
    public MealResponse update(Long id, MealUpdateRequest req) {
        validate(req.getDate(),req.getType(),req.getName(),req.getCalories());

            Meal meal= mealRepository.findById(id)
                    .orElseThrow(()->new IllegalArgumentException("meal not found"+id));

            meal.update(req.getDate(),req.getType(),req.getName(),req.getCalories(),req.getMemo());
            return new MealResponse(meal);


    }

//    삭제
    public void delete(Long id) {
        if(!mealRepository.existsById(id)) throw new IllegalArgumentException("meal not found"+id);
        mealRepository.deleteById(id);
    }

//    검증함수
    private void validate(LocalDate date,Object type,String name,Integer calories){
        if(date==null) throw new IllegalArgumentException("date is required");
        if(type==null) throw new IllegalArgumentException("type is required");
        if(name==null) throw new IllegalArgumentException("name is required");
        if(calories==null) throw new IllegalArgumentException("calories must be >=0");
    }

}
