package jpabook.jpabasic.api;

import jpabook.jpabasic.api.dto.MealCreateRequest;
import jpabook.jpabasic.api.dto.MealDailyResponse;
import jpabook.jpabasic.api.dto.MealResponse;
import jpabook.jpabasic.api.dto.MealUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jpabook.jpabasic.service.MealService;

import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/meals")
public class MealController {


    private final MealService mealService;

    @PostMapping
    public ResponseEntity<MealResponse> create(@RequestBody MealCreateRequest req){
        return ResponseEntity.status(201).body(mealService.create(req));

    }

    @GetMapping
    public ResponseEntity<MealDailyResponse> findByDate(@RequestParam LocalDate date){
        return ResponseEntity.ok(mealService.findByDate(date));

    }
    @GetMapping("/{id}")

    public ResponseEntity<MealResponse> findOne(@PathVariable Long id){
        return ResponseEntity.ok(mealService.findOne(id));
    }


    @PutMapping("/{id}")
    public ResponseEntity<MealResponse> update(@PathVariable Long id,@RequestBody MealUpdateRequest req){
        return ResponseEntity.ok(mealService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        mealService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
