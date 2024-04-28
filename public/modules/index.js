async function fetchFunction(Url,method,payload,next){
    try {
      const options = {
        method: method || 'GET', // Default to GET if method is not provided
        headers: {
          'Content-Type':'application/json', // Set content type to JSON
        }
      };
  
      if (payload) {
        options.body = JSON.stringify(payload); // Include payload in request body if provided
      }
  
      const response = await fetch(Url, options);
    
      const data = await response.json();
      next(data,response); // Send data to the next function
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
}
$(document).ready(function(){

    fetchFunction("/fetch/allCourses","post",{},function(data){
        console.log(data)
        $(".library-all").empty();
        for(var course of data){
            $(".library-all").append(`
            <div class="col-lg-4 col-xl-3 col-sm-6">

                <div class="card card--elevated card-course overlay js-overlay mdk-reveal js-mdk-reveal " data-partial-height="40" data-toggle="popover" data-trigger="click">


                    <a href="course.html" class="js-image" data-position="center">
                        <img src="assets/images/paths/angular_430x168.png" alt="course">
                        <span class="overlay__content">
                            <span class="overlay__action d-flex flex-column text-center">
                                <i class="material-icons">play_circle_outline</i>
                                <small>Preview course</small>
                            </span>
                        </span>
                    </a>

                    <span class="corner-ribbon corner-ribbon--default-right-top corner-ribbon--shadow bg-accent text-white">NEW</span>

                    <div class="mdk-reveal__content">
                        <div class="card-body">
                            <div class="d-flex">
                                <div class="flex">
                                    <a class="card-title" href="course.html">{{course.hcName}}</a>
                                    <small class="text-50 font-weight-bold mb-4pt">Elijah Murray</small>
                                </div>
                                <a href="course.html" class="ml-4pt material-icons text-20 card-course__icon-favorite">favorite</a>
                            </div>
                            <div class="d-flex">
                                <div class="rating flex">
                                    <span class="rating__item"><span class="material-icons">star</span></span>
                                    <span class="rating__item"><span class="material-icons">star</span></span>
                                    <span class="rating__item"><span class="material-icons">star</span></span>
                                    <span class="rating__item"><span class="material-icons">star</span></span>
                                    <span class="rating__item"><span class="material-icons">star_border</span></span>
                                </div>
                                <small class="text-50">6 hours</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="popoverContainer d-none">
                    <div class="media">
                        <div class="media-left">
                            <img src="assets/images/paths/angular_40x40@2x.png" width="40" height="40" alt="Angular" class="rounded">
                        </div>
                        <div class="media-body">
                            <div class="card-title mb-0">Learn Angular fundamentals</div>
                            <p class="lh-1 mb-0">
                                <span class="text-black-50 small">with</span>
                                <span class="text-black-50 small font-weight-bold">Elijah Murray</span>
                            </p>
                        </div>
                    </div>

                    <p class="my-16pt text-black-70">Learn the fundamentals of working with Angular and how to create basic applications.</p>

                    <div class="mb-16pt">
                        <div class="d-flex align-items-center">
                            <span class="material-icons icon-16pt text-black-50 mr-8pt">check</span>
                            <p class="flex text-black-50 lh-1 mb-0"><small>Fundamentals of working with Angular</small></p>
                        </div>
                        <div class="d-flex align-items-center">
                            <span class="material-icons icon-16pt text-black-50 mr-8pt">check</span>
                            <p class="flex text-black-50 lh-1 mb-0"><small>Create complete Angular applications</small></p>
                        </div>
                        <div class="d-flex align-items-center">
                            <span class="material-icons icon-16pt text-black-50 mr-8pt">check</span>
                            <p class="flex text-black-50 lh-1 mb-0"><small>Working with the Angular CLI</small></p>
                        </div>
                        <div class="d-flex align-items-center">
                            <span class="material-icons icon-16pt text-black-50 mr-8pt">check</span>
                            <p class="flex text-black-50 lh-1 mb-0"><small>Understanding Dependency Injection</small></p>
                        </div>
                        <div class="d-flex align-items-center">
                            <span class="material-icons icon-16pt text-black-50 mr-8pt">check</span>
                            <p class="flex text-black-50 lh-1 mb-0"><small>Testing with Angular</small></p>
                        </div>
                    </div>

                    <div class="row align-items-center">
                        <div class="col-auto">
                            <div class="d-flex align-items-center mb-4pt">
                                <span class="material-icons icon-16pt text-black-50 mr-4pt">access_time</span>
                                <p class="flex text-black-50 lh-1 mb-0"><small>6 hours</small></p>
                            </div>
                            <div class="d-flex align-items-center mb-4pt">
                                <span class="material-icons icon-16pt text-black-50 mr-4pt">play_circle_outline</span>
                                <p class="flex text-black-50 lh-1 mb-0"><small>12 lessons</small></p>
                            </div>
                            <div class="d-flex align-items-center">
                                <span class="material-icons icon-16pt text-black-50 mr-4pt">assessment</span>
                                <p class="flex text-black-50 lh-1 mb-0"><small>Beginner</small></p>
                            </div>
                        </div>
                        <div class="col text-right">
                            <a href="course.html" class="btn btn-primary">Watch trailer</a>
                        </div>
                    </div>

                </div>

            </div>
            `);
        }
    })
})