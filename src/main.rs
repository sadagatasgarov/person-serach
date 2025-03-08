use actix_web::{web, App, HttpServer, Responder};
use actix_cors::Cors;
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct SearchQuery {
    name: Option<String>,
    birth_date: Option<String>,
    page: Option<usize>,
    limit: Option<usize>,
}

#[derive(Serialize)]
#[derive(Clone)]
struct Person {
    id: usize,
    name: String,
    birth_date: String,
    characteristics: String,
}


#[derive(Serialize)]
struct SearchResponse {
    results: Vec<Person>,
    total: usize,
}

async fn search(query: web::Query<SearchQuery>) -> impl Responder {
    let people = vec![
        Person {
            id: 1,
            name: "Sadagat Asgarov".to_string(),
            birth_date: "1991-01-01".to_string(),
            characteristics: "Rust bagimlisi".to_string(),
        },
        Person {
            id: 2,
            name: "Rashad Rustamov".to_string(),
            birth_date: "1985-01-01".to_string(),
            characteristics: "Səbəkə və sistem".to_string(),
        },

        Person {
            id: 3,
            name: "Netavan Kerimova".to_string(),
            birth_date: "1980-01-01".to_string(),
            characteristics: "Astrolog".to_string(),
        },
        Person {
            id: 4,
            name: "Əliyev Vəli".to_string(),
            birth_date: "1985-01-01".to_string(),
            characteristics: "Ne is gorur bilinmir".to_string(),
        },

        Person {
            id: 5,
            name: "Huseynov Huseyn".to_string(),
            birth_date: "1991-01-01".to_string(),
            characteristics: "ne deyim".to_string(),
        },
        Person {
            id: 6,
            name: "Vəliyev Vəli".to_string(),
            birth_date: "1985-01-01".to_string(),
            characteristics: "Bu da basqa bir xasiyyet".to_string(),
        },
    ];

    let filtered_people: Vec<Person> = people
        .into_iter()
        .filter(|p| {
            query
                .name
                .as_ref()
                .map(|name| p.name.to_lowercase().contains(&name.to_lowercase()))
                .unwrap_or(true)
                && query
                    .birth_date
                    .as_ref()
                    .map(|date| p.birth_date == *date)
                    .unwrap_or(true)
        })
        .collect();

    let total = filtered_people.len();
    let page = query.page.unwrap_or(1);
    let limit = query.limit.unwrap_or(1);
    let start = (page - 1) * limit;
    let end = start + limit;
    let paginated_results = filtered_people[start.min(total)..end.min(total)].to_vec();

    web::Json(SearchResponse {
        results: paginated_results,
        total,
    })
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();

        App::new()
            .wrap(cors)
            .route("/search", web::get().to(search))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
