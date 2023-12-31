/*----------------------------------------------------------------------------------------------------*/

/*                                             GAME UI                                                */

/*----------------------------------------------------------------------------------------------------*/

class GameUI
{

    constructor()
    {
        this.music = null
        this.values =
        {
            score: 0,
            lines: 0,
        }
        this.screen_values =
        {
            score: 0,
            lines: 0,
        }
        this.intervals = 
        {
            score: 0,
            lines: 0,
        }
    }

    try_to_play_sound(sound_name)
    {
        if(Settings.get_property("sounds") == true)
            main_ui.play_sound(sound_name)
    }

    set_music(game_mode)
    {
        this.music = new Audio(data.GameModeToMusic[game_mode])
        this.music.loop = true
    }

    pause_music()
    {
        this.music.pause()
    }

    play_music()
    {
        this.music.play()
    }

    create_chars(id_prefix)
    {
        let html = ""
        for(let i = 0; i < data.chars_in_values; ++i)
            html += `<img id="${id_prefix}${i}" class="digit" draggable="false"></img>\n`
        get_first_from_class(`value ${id_prefix}`).innerHTML = html
    }

    create_board(size, reverse)
    {
        this.create_any_board("board", size, reverse)
    }
    
    create_preview_board(size, reverse)
    {
        this.create_any_board("preview", size, reverse)
    }


    create_any_board(id_prefix, size, reverse)
    {
        let html = ""
        if(reverse == false)
        {
            for(let y = 0; y < size.height; ++y)
            {
                for(let x = 0; x < size.width; ++x)
                    html += `<div id="${id_prefix}${y};${x}" class="pixel"></div>\n`
            }
        }
        else
        {
            for(let y = data.board_sizes[id_prefix].height - 1; y >= 0 ; --y)
            {
                for(let x = 0; x < data.board_sizes[id_prefix].width; ++x)
                    html += `<div id="${id_prefix}${y};${x}" class="pixel"></div>\n`
            }
        }
        get_id(id_prefix).innerHTML += html
    }

    refresh_controls(reverse)
    {
        if(reverse == true)
            get_id("controls").classList.add("reverse")
    }

    refresh_speed(speed)
    {
        get_id("speed-img-value").src = data.GameSpeedToImgs[speed]
    }

    refresh_game_mode(game_mode)
    {
        get_id("game-mode-img-value").src = data.GameModeToImgs[game_mode]
    }  

    refresh_board(board)
    {
        this.refresh_any_board("board", board)
    }

    refresh_preview_board(preview_board)
    {
        this.refresh_any_board("preview", preview_board)
    }

    refresh_any_board(id_prefix, board)
    {
        for(let y = 0; y < board.height; ++y)
        {
            for(let x = 0; x < board.width; ++x)
            {
                const screen_pixel = get_id(`${id_prefix + y};${x}`)
                let board_pixel = board.get_pixel(x, y)
                screen_pixel.className = "pixel"
                if(board_pixel.modifier != null)
                    screen_pixel.classList.add(data.ModifierTypeToClass[board_pixel.modifier], "modified")
                else
                    screen_pixel.classList.add(board_pixel.color)
                if(board_pixel.transparent == true)
                    screen_pixel.classList.add("transparent")
                if(board_pixel.content == 0 || isIn(board_pixel.modifier, [ModifierType.ice, ModifierType.fire]))
                    screen_pixel.textContent = ""
                else
                    screen_pixel.textContent = board_pixel.content
            }
        }
    }

    get_max_value()
    {
        let score = 0;
        for(let i = 0; i < data.chars_in_values; ++i)
        {
            score *= 10
            score += 9
        }
        return score
    }

    instant_value_refresh(id_prefix, value)
    {
        this.screen_values[id_prefix] = value
        let chars = slice_number(value)
        let number_of_chars = chars.length
        if(number_of_chars > data.chars_in_values)
        {
            this.instant_value_refresh(id_prefix, this.get_max_value())
        }
        else
        {
            for(let i = 0; i < number_of_chars; ++i)
                get_id(id_prefix + i).src = get_src("chars", chars[i])
        }
    }

    calculate_step(difference)
    {
        let separator = 10
        while(difference > separator)
            separator *= 10
        return separator / 10
    }

    smooth_value_refresh(value_type)
    {
        clearInterval(this.intervals[value_type])
        let self = this
        this.intervals[value_type] = setInterval( function() {
            if(self.screen_values[value_type] < self.values[value_type])
            {
                self.screen_values[value_type] += self.calculate_step(self.values[value_type] - self.screen_values[value_type])
                self.instant_value_refresh(`${value_type}`, self.screen_values[value_type])
            }
            else
            {
                self.instant_value_refresh(`${value_type}`, self.screen_values[value_type])
                clearInterval(self.intervals[value_type])
            }
        }, data.delays.value_update)
    }

    refresh_score_value(score, instant = false)
    {
        this.refresh_value("score", score, instant)
    }

    refresh_lines_value(lines, instant = false)
    {
        this.refresh_value("lines", lines, instant)
    }

    refresh_value(value_type, value, instant)
    {
        this.values[value_type] = value
        if(data.delays.value_update == 0 || instant == true)
            this.instant_value_refresh(value_type, value)
        else
            this.smooth_value_refresh(value_type)
    }

    refresh_button(button)
    {
        get_id("game-button").src = button
    }
}